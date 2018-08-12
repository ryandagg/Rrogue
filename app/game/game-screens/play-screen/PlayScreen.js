import {
	DISPLAY_OPTIONS,
	MAP_SIZE,
	DEBUG_DISPLAY,
} from 'app/game/GameConstants';
import GameMap from 'app/game/objects/GameMap';
import { forEachOfLength } from 'app/utils/ArrayUtils';
import Entity from 'app/game/objects/entities/Entity';
import playerTemplate from 'app/game/templates/actors/PlayerTemplate';
import LevelBuilder from 'app/game/objects/LevelBuilder';
import {refreshScreen} from 'app/game/GameInterface';
import {setGamePlaying} from 'app/components/game-info/GameActions';
import {dispatch} from 'app/game/ReduxUtils';
import {getStartForPattern} from 'app/utils/MatrixUtils';
import inputHandler from './PlayScreenInputHandler';


const getSpellOverlay = (center, spell) => {
	let result = {};
	const pattern = spell ? spell.getTargetPattern() : [];
	const {x: xStart, y: yStart} = getStartForPattern(center, pattern);
	pattern.forEach((row, xIndex) => {
		let newRow = {};
		row.forEach((isIn, yIndex) => {
			newRow[yStart + yIndex] = isIn;
		});
		result[xStart + xIndex] = newRow;

	});
	return result;
};

export default class PlayScreen {
	_map = null;
	_player = null;
	_gameEnded = false;
	_spellSelected = null;
	_spellCenter = {};

	setSubScreen = (subScreen, setupArgs) => {
		this._subScreen = subScreen;
		if (subScreen && subScreen.setup) subScreen.setup(setupArgs, () => this.setSubScreen(null));

		// Refresh screen on changing the subscreen
		refreshScreen();
	};

	getMap = () => this._map;
	setMap = map => (this._map = map);

	move = (dX, dY, dZ = 0) => {
		const newX = this._player.getX() + dX;
		const newY = this._player.getY() + dY;
		const newZ = this._player.getZ() + dZ;

		// Try to move to the new cell
		const didMove = this._player.tryMove(newX, newY, newZ, this.getMap());
		if (didMove) {
			// Unlock the engine
			this._map.unlockEngine(this._player.getZ());
		}
	};

	setGameOver = () => this._gameEnded = true;

	enter = () => {
		dispatch(setGamePlaying(true));
		const tiles = new LevelBuilder({
			width: MAP_SIZE.width,
			height: MAP_SIZE.height,
			maxDepth: 3,
		}).getTiles();

		// Create our player and set the position
		this._player = new Entity(playerTemplate);
		this._map = new GameMap(tiles, this._player);

		// this prevents some issues with dependencies firing upon start up that require this
		setTimeout(() => this._map.getEngine(this._player.getZ()).start());
	};

	exit = function() {
		// console.log('Exited start screen.');
	};

	_getDisplayDimensionOffset = (XY, mapDimension) => {
		// Make sure the x-axis doesn't go to the left of the left bound
		// Make sure we still have enough space to fit an entire game screen
		return DEBUG_DISPLAY
			? 0 // don't center if debugging
			: Math.min(
					Math.max(
						0,
						Math.floor(
							this._player[`get${XY}`]() - mapDimension / 2,
						),
					),
					this._map.getWidth() - mapDimension,
			  );
	};

	_getDisplayOffsets = () => ({
		topLeftX: this._getDisplayDimensionOffset('X', DISPLAY_OPTIONS.width),
		topLeftY: this._getDisplayDimensionOffset('Y', DISPLAY_OPTIONS.height),
	});

	render = display => {
		// Render subscreen if there is one
		if (this._subScreen) {
			this._subScreen.render(display);
			return;
		}

		const { topLeftX, topLeftY } = this._getDisplayOffsets();
		const currentDepth = this._player.getZ();


		const visibleCells = {};

		// Find all visible cells and update the object
		this._map.getFov(currentDepth).compute(
			this._player.getX(),
			this._player.getY(),
			this._player.getSightRadius(),
			(x, y) => {
				if (!visibleCells[x]) visibleCells[x] = {};
				visibleCells[x][y] = true;
				this._map.setExplored(x, y, currentDepth, true);
			});

		const spellOverlay = getSpellOverlay(this._spellCenter, this._spellSelected);

		forEachOfLength(DISPLAY_OPTIONS.width, x => {
			// Add all the tiles
			const offsetX = x + topLeftX;
			forEachOfLength(DISPLAY_OPTIONS.height, y => {
				const offsetY = y + topLeftY;
				const visible = visibleCells[offsetX] && visibleCells[offsetX][offsetY];

				if (DEBUG_DISPLAY || visible || this._map.isExplored(offsetX, offsetY, currentDepth)) {
					// Check if we have an entity at the position
					let glyph = this._map.getEntityAt(offsetX, offsetY, currentDepth);

					// Check for items
					if (!glyph) {
						const items = this._map.getItemsAt(offsetX, offsetY, currentDepth);
						if (items && items.length) {
							// If we have items, we want to render the top most item
							glyph = items[items.length - 1];
						}
					}

					// if nothing here, use the empty tile
					if (!glyph) glyph = this._map.getTile(offsetX, offsetY, currentDepth);

					// The foreground color becomes dark gray if the tile has been
					// explored but is not visible
					display.draw(
						x,
						y,
						glyph.getChar(),
						visible ? glyph.getForeground() : 'darkGray',
						spellOverlay[offsetX] && spellOverlay[offsetX][offsetY]
							? 'lightBlue'
							: glyph.getBackground(),
					);
				}
			});
		});
	};


	/**
	 *
	 * input handler functions
	 *
	 **/
	_moveN = () => this.move(0, -1);
	_moveS = () => this.move(0, 1);
	_moveE = () => this.move(1, 0);
	_moveW = () => this.move(-1, 0);
	_moveNW = () => this.move(-1, -1);
	_moveNE = () => this.move(1, -1);
	_moveSW = () => this.move(-1, 1);
	_moveSE = () => this.move(1, 1);
	_moveDown = () => this.move(0, 0, 1);
	_moveUp = () => this.move(0, 0, -1);


	_setTargetSpell = (index) => {
		this._spellSelected = this._player.spells[index];
		// todo: logic for picking default target
		this._spellCenter = {x: this._player.getX(), y: this._player.getY()};
		refreshScreen();
	};

	_fireSelectedSpell = () => {
		this._player.cast(this._spellCenter, this._spellSelected);
		this._spellSelected = null;
		this._map.unlockEngine(this._player.getZ());
	};

	_adjustSpellCenter = (x, y) => {
		this._spellCenter.x += x;
		this._spellCenter.y += y;
		refreshScreen();
	};

	_moveTargetN = () => this._adjustSpellCenter(0, -1);
	_moveTargetS = () => this._adjustSpellCenter(0, 1);
	_moveTargetE = () => this._adjustSpellCenter(1, 0);
	_moveTargetW = () => this._adjustSpellCenter(-1, 0);
	_moveTargetNW = () => this._adjustSpellCenter(-1, -1);
	_moveTargetNE = () => this._adjustSpellCenter(1, -1);
	_moveTargetSW = () => this._adjustSpellCenter(-1, 1);
	_moveTargetSE = () => this._adjustSpellCenter(1, 1);

	// moved out this file because I don't like looking at switch statements
	handleInput = inputHandler.bind(this);
}
