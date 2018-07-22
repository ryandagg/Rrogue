import ROT from 'rot-js';
import {refreshScreen, sendMessage} from 'app/game/GameInterface';
import {KEY_DOWN} from 'app/game/GameConstants';

const letters = 'abcdefghijklmnopqrstuvwxyz';

export default class ItemListScreen {
	constructor({caption, handleOk, canSelectMultipleItems, canSelect, handleClose}) {
		// Set up based on the template
		this._caption = caption;
		this._handleOk = handleOk;
		// Whether the user can select items at all.
		this._canSelectItem = canSelect;
		// Whether the user can select multiple items.
		this._canSelectMultipleItems = canSelectMultipleItems;
		this._handleClose = handleClose;
	};

	setup = ({player, items}, handleClose) => {
		this._player = player;
		// Should be called before switching to the screen.
		this._items = items;
		// Clean set of selected indices
		this._selectedIndices = {};
		this._handleClose = handleClose;
	};

	render = (display) => {
		// Render the caption in the top row
		display.drawText(0, 0, this._caption);
		let row = 0;

		this._items.forEach((item, i) => {
			// If we have an item, we want to render it.
			if (item) {
				// Get the letter matching the item's index
				const letter = letters.substring(i, i + 1);
				// If we have selected an item, show a +, else show a dash between
				// the letter and the item's name.
				const selectionState = (this._canSelectItem && this._canSelectMultipleItems &&
					this._selectedIndices[i]) ? '+' : '-';
				// Render at the correct row and add 2.
				display.drawText(0, 2 + row, letter + ' ' + selectionState + ' ' + item.describe());
				row++;
			}
		});
	};

	executeOkFunction = () => {
		// Gather the selected items.
		const selectedItems = Object.keys(this._selectedIndices).reduce((result, key) => {
			result[key] = this._items[key];
			return result;
		});

		// Switch back to the play screen.
		this._handleClose();

		// Call the OK function and end the player's turn if it return true.
		if (this._handleOk(selectedItems)) {
			this._player.getMap().getEngine(this._player.getZ()).unlock();
		}
	};

	handleInput = (inputType, inputData) => {
		if (inputType === KEY_DOWN) {
			// If the user hit escape, hit enter and can't select an item, or hit
			// enter without any items selected, simply cancel out
			if (inputData.keyCode === ROT.VK_ESCAPE ||
				(inputData.keyCode === ROT.VK_RETURN &&
					(!this._canSelectItem || Object.keys(this._selectedIndices).length === 0))) {
				// Switch back to the play screen.
				this._handleClose();
				// Handle pressing return when items are selected
			} else if (inputData.keyCode === ROT.VK_RETURN) {
				this.executeOkFunction();
				// Handle pressing a letter if we can select
			} else if (this._canSelectItem && inputData.keyCode >= ROT.VK_A &&
				inputData.keyCode <= ROT.VK_Z) {
				// Check if it maps to a valid item by subtracting 'a' from the character
				// to know what letter of the alphabet we used.
				const index = inputData.keyCode - ROT.VK_A;
				if (this._items[index]) {
					// If multiple selection is allowed, toggle the selection status, else
					// select the item and exit the screen
					if (this._canSelectMultipleItems) {
						if (this._selectedIndices[index]) {
							delete this._selectedIndices[index];
						} else {
							this._selectedIndices[index] = true;
						}
						// Redraw screen
						refreshScreen();
					} else {
						this._selectedIndices[index] = true;
						this.executeOkFunction();
					}
				}
			}
		}
	};
}

export const inventoryScreen = new ItemListScreen({
	caption: 'Inventory',
	canSelect: false,
});

export const pickupScreen = new ItemListScreen({
	caption: 'Choose the items you wish to pickup',
	canSelect: true,
	canSelectMultipleItems: true,
	handleOk: function(selectedItems) {
		// Try to pick up all items, messaging the player if they couldn't all be
		// picked up.
		if (!this._player.pickupItems(Object.keys(selectedItems))) {
			sendMessage(this._player, 'Your inventory is full! Not all items were picked up.');
		}
		return true;
	},
});

export const dropScreen = new ItemListScreen({
	caption: 'Choose the item you wish to drop',
	canSelect: true,
	canSelectMultipleItems: false,
	handleOk: function(selectedItems) {
		// Drop the selected item
		this._player.dropItem(Object.keys(selectedItems)[0]);
		return true;
	},
});
