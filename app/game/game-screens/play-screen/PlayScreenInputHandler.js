import { spellScreenTemplate } from 'app/components/screens/SpellScreen';
import { dropScreen, inventoryScreen, pickupScreen } from 'app/game/game-screens/ItemListScreen';
import reactOverlay from 'app/game/game-screens/ReactOverlayScreen';
import { GAME_OVER_SCREEN } from 'app/game/game-screens/ScreenNameConstants';
import { COMPASS_KEYS, KEY_DOWN } from 'app/game/GameConstants';
import { refreshScreen, sendMessage, switchScreen } from 'app/game/GameInterface';
import ROT from 'rot-js';

// 'this' is bound from PlayScreen. Only separated this out to make the file more readable.
export default function(inputType, inputData) {
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

		if (this._spellSelected) {
			switch (inputData.keyCode) {
				case COMPASS_KEYS.WEST:
					this.moveTargetW();
					break;
				case COMPASS_KEYS.EAST:
					this.moveTargetE();
					break;
				case COMPASS_KEYS.NORTH:
					this.moveTargetN();
					break;
				case COMPASS_KEYS.SOUTH:
					this.moveTargetS();
					break;
				case COMPASS_KEYS.NORTHWEST:
					this.moveTargetNW();
					break;
				case COMPASS_KEYS.NORTHEAST:
					this.moveTargetNE();
					break;
				case COMPASS_KEYS.SOUTHWEST:
					this.moveTargetSW();
					break;
				case COMPASS_KEYS.SOUTHEAST:
					this.moveTargetSE();
					break;
				case ROT.VK_RETURN:
					this.fireSelectedSpell();
					break;
				default:
					break;
			}
		} else if (inputData.shiftKey) {
			// looking at .key here because it's easier than keeping track of shift key state
			// todo: look at .key instead of keyCode for all key presses??
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
				case ROT.VK_S: {
					// Show the spells screen in React
					this.setSubScreen(reactOverlay(spellScreenTemplate));
					break;
				}
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
				case COMPASS_KEYS.WEST:
					this.moveW();
					break;
				case COMPASS_KEYS.EAST:
					this.moveE();
					break;
				case COMPASS_KEYS.NORTH:
					this.moveN();
					break;
				case COMPASS_KEYS.SOUTH:
					this.moveS();
					break;
				case COMPASS_KEYS.NORTHWEST:
					this.moveNW();
					break;
				case COMPASS_KEYS.NORTHEAST:
					this.moveNE();
					break;
				case COMPASS_KEYS.SOUTHWEST:
					this.moveSW();
					break;
				case COMPASS_KEYS.SOUTHEAST:
					this.moveSE();
					break;
				case ROT.VK_PERIOD:
					this.move(0, 0);
					break;
				case ROT.VK_1:
					this.setTargetSpell(0);
					break;
				case ROT.VK_2:
					this.setTargetSpell(1);
					break;
				case ROT.VK_3:
					this.setTargetSpell(2);
					break;
				case ROT.VK_4:
					this.setTargetSpell(3);
					break;
				case ROT.VK_5:
					this.setTargetSpell(4);
					break;
				case ROT.VK_6:
					this.setTargetSpell(5);
					break;
				case ROT.VK_7:
					this.setTargetSpell(6);
					break;
				case ROT.VK_8:
					this.setTargetSpell(7);
					break;
				case ROT.VK_9:
					this.setTargetSpell(8);
					break;
				case ROT.VK_0:
					this.setTargetSpell(9);
					break;

				default:
					break;
			}
		}
	}
};
