import ROT from 'rot-js';
import {
	DISPLAY_OPTIONS,
	MAP_SIZE,
	DEBUG_DISPLAY,
	KEY_DOWN,
} from 'app/game/GameConstants';
import GameMap from 'app/game/objects/GameMap';
import { forEachOfLength } from 'app/utils/ArrayUtils';
import Entity from 'app/game/objects/entities/Entity';
import playerTemplate from 'app/game/templates/actors/PlayerTemplate';
import LevelBuilder from 'app/game/objects/LevelBuilder';
import {switchScreen, refreshScreen, sendMessage} from 'app/game/GameInterface';
import {GAME_OVER_SCREEN} from 'app/game/game-screens/ScreenNameConstants';
import {inventoryScreen, pickupScreen, dropScreen} from 'app/game/game-screens/ItemListScreen';


export default class PlayScreen {
	_map = null;
	_player = null;
	_gameEnded = false;

	setSubScreen = (subScreen, setupArgs) => {
		this._subScreen = subScreen;
		if (subScreen) subScreen.setup(setupArgs, () => this.setSubScreen(null));

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
			this._map.getEngine(this._player.getZ()).unlock();
		}
	};

	setGameOver = () => this._gameEnded = true;

	enter = () => {
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
						glyph.getBackground(),
					);
				}
			});
		});

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
		const stats = '%c{white}%b{black}' + `HP: ${this._player.getHp()}/${this._player.getMaxHp()}`;
		display.drawText(0, DISPLAY_OPTIONS.height - 1, stats);
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
		if (inputType === KEY_DOWN) {
			// If the game is over, enter will bring the user to the losing screen.
			if (this._gameEnded) {
				if (inputData.keyCode === ROT.VK_RETURN) {
					switchScreen(GAME_OVER_SCREEN);
					// Return to make sure the user can't still play
				}
				return;
			}

			if (this._subScreen) {
				this._subScreen.handleInput(inputType, inputData);
				return;
			}


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
					case ROT.VK_I: {
						const hasItems = this._player.getItems().filter(x => !!x).length === 0;
						if (hasItems) {
							// If the player has no items, send a message and don't take a turn
							sendMessage(this._player, 'You are not carrying anything!');
							refreshScreen();
						} else {
							// Show the inventory
							this.setSubScreen(inventoryScreen, {player: this._player, items: this._player.getItems()});
						}
						break;
					}
					case ROT.VK_D: {
						const hasItems = this._player.getItems().filter(x => !!x).length === 0;
						if (hasItems) {
							// If the player has no items, send a message and don't take a turn
							sendMessage(this._player, 'You have nothing to drop!');
							refreshScreen();
						} else {
							// Show the drop screen
							this.setSubScreen(dropScreen, {player: this._player, items: this._player.getItems()});
						}
						break;
					}
					case ROT.VK_COMMA: {
						const items = this._map.getItemsAt(this._player.getX(), this._player.getY(), this._player.getZ());
						// If there are no items, show a message
						if (!items) {
							sendMessage(this._player, 'There is nothing here to pick up.');
						} else {
							// Show the pickup screen if there are any items
							this.setSubScreen(pickupScreen, {player: this._player, items});
							return;
						}
						break;
					}
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
					case ROT.VK_PERIOD:
						this.move(0, 0);
						break;
					default:
						break;
				}
			}
		}
	};
}
