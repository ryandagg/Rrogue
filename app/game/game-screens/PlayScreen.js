import ROT from 'rot-js';
import {
	DISPLAY_OPTIONS,
	MAP_GENERATOR_TYPES,
	MAP_CONFIGS,
	MAP_GENERATOR_TYPE,
	MAP_SIZE,
	DEBUG_DISPLAY,
} from '../GameConstants';
import {
	getNullTile,
	getFloorTile,
	getWallTile,
} from 'app/game/objects/tile/TileUtils';
import GameMap from 'app/game/objects/GameMap';
import { forEachOfLength } from 'app/utils/ArrayUtils';
import { refreshScreen } from 'app/game/GameInterface';
import Entity from 'app/game/objects/entities/Entity';
import playerTemplate from 'app/game/templates/PlayerTemplate';
import LevelBuilder from 'app/game/objects/LevelBuilder'
import { vsprintf } from 'sprintf';


export default class PlayScreen {
	_map = null;
	_player = null;

	getMap = () => this._map;
	setMap = map => (this._map = map);

	move = (dX, dY, dZ = 0) => {
		const newX = this._player.getX() + dX;
		const newY = this._player.getY() + dY;
		const newZ = this._player.getZ() + dZ;

		// Try to move to the new cell
		const didMove = this._player.tryMove(newX, newY, newZ, this.getMap());
		if (didMove) {
			refreshScreen();
			// Unlock the engine
			this._map.getEngine().unlock();
		}
	};

	enter = () => {
		const tiles = new LevelBuilder({
			width: MAP_SIZE.width,
			height: MAP_SIZE.height,
			maxDepth: 3,
		}).getTiles();

		// Create our player and set the position
		this._player = new Entity(playerTemplate);
		this._map = new GameMap(tiles, this._player);

		setTimeout(() => this._map.getEngine().start());
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
		const { topLeftX, topLeftY } = this._getDisplayOffsets();

		forEachOfLength(DISPLAY_OPTIONS.width, x => {
			// Add all the tiles
			const offsetX = x + topLeftX;
			forEachOfLength(DISPLAY_OPTIONS.height, y => {
				const offsetY = y + topLeftY;
				const tile = this._map.getTile(offsetX, offsetY, this._player.getZ());
				display.draw(
					x,
					y,
					tile.getChar(),
					tile.getForeground(),
					tile.getBackground(),
				);
			});
		});

		// Render the player
		// this is kind of gross due to it being side loaded on, will come up with a better system if problems occur
		display.draw(
			this._player.getX() - topLeftX,
			this._player.getY() - topLeftY,
			this._player.getChar(),
			this._player.getForeground(),
			this._player.getBackground(),
		);

		// Get the messages in the player's queue and render them
		const messages = this._player.getMessages();
		let messageY = 0;
		messages.forEach(message => {
			// Draw each message, adding the number of lines
			messageY += display.drawText(
				0,
				messageY,
				'%c{white}%b{black}' + message,
			);
		});

		// Render player HP
		const stats =
			'%c{white}%b{black}' +
			vsprintf('HP: %d/%d ', [
				this._player.getHp(),
				this._player.getMaxHp(),
			]);
		display.drawText(0, DISPLAY_OPTIONS.height - 1, stats);

		this.getMap()
			.getEntities()
			.forEach(entity => {
				if (
					entity.getX() >= topLeftX &&
					entity.getY() >= topLeftY &&
					entity.getX() < topLeftX + DISPLAY_OPTIONS.width &&
					entity.getY() < topLeftY + DISPLAY_OPTIONS.height
				) {
					display.draw(
						entity.getX() - topLeftX,
						entity.getY() - topLeftY,
						entity.getChar(),
						entity.getForeground(),
						entity.getBackground(),
					);
				}
			});
	};

	moveN = () => this.move(0, -1);
	moveS = () => this.move(0, 1);
	moveE = () => this.move(1, 0);
	moveW = () => this.move(-1, 0);
	moveNW = () => this.move(-1, -1);
	moveNE = () => this.move(1, -1);
	moveSW = () => this.move(-1, 1);
	moveSE = () => this.move(1, 1);
	moveDown = () => this.move(0, 0, 1);
	moveUp = () => this.move(0, 0, -1);

	handleInput = (inputType, inputData) => {
		if (inputType === 'keydown') {
			// Movement
			if (inputData.shiftKey) {
				switch (inputData.key) {
					case '>':
						this.moveDown();
						break;
					case '<':
						this.moveUp();
						break;
					default:
						break;
				}
			} else {
				switch (inputData.keyCode) {
					// traditional roguelike bindings
					case ROT.VK_H:
						this.moveW();
						break;
					case ROT.VK_L:
						this.moveE();
						break;
					case ROT.VK_K:
						this.moveN();
						break;
					case ROT.VK_J:
						this.moveS();
						break;
					case ROT.VK_Y:
						this.moveNW();
						break;
					case ROT.VK_U:
						this.moveNE();
						break;
					case ROT.VK_B:
						this.moveSW();
						break;
					case ROT.VK_N:
						this.moveSE();
						break;

					default:
						break;
				}

			}
		}
	};
}
