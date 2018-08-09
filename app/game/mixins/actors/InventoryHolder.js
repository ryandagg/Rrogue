import { getArrayOfLength } from 'app/utils/ArrayUtils';


export default {
	name: 'InventoryHolder',
	init: function({startingInventory = [], inventorySlots = 10}) {
		// Default to 10 inventory slots.
		// Set up an empty inventory.
		this._items = startingInventory.concat(getArrayOfLength(inventorySlots - startingInventory.length));
	},

	getItems: function() {
		return this._items;
	},

	getItem: function(i) {
		return this._items[i];
	},

	addItem: function(item) {
		const index = this._items.findIndex(item => !item);
		// Try to find a slot, returning true only if we could add the item.
		if (index > -1) {
			this._items[index] = item;
			return true;
		}
		return false;
	},

	removeItem: function(i) {
		// Clear the inventory slot.
		this._items[i] = undefined;
	},

	canAddItem: function() {
		// Check if we have an empty slot.
		return this._items.findIndex(item => !item) > -1;
	},

	pickupItems: function(indices) {
		// Allows the user to pick up items from the map, where indices is
		// the indices for the array returned by map.getItemsAt
		const mapItems = this._map.getItemsAt(this.getX(), this.getY(), this.getZ());
		let added = 0;
		// Iterate through all indices.
		indices.find(index => {
			// Try to add the item. If our inventory is not full, then splice the
			// item out of the list of items. In order to fetch the right item, we
			// have to offset the number of items already added.
			if (this.addItem(mapItems[index  - added])) {
				mapItems.splice(index - added, 1);
				added++;
			} else {
				// Inventory is full, break iteration
				return true;
			}
		});

		// Update the map items
		this._map.setItemsAt(this.getX(), this.getY(), this.getZ(), mapItems);

		// Return true only if we added all items
		return added === indices.length;
	},
	dropItem: function(i) {
		// Drops an item to the current map tile
		if (this._items[i]) {
			if (this._map) {
				this._map.addItem(this.getX(), this.getY(), this.getZ(), this._items[i]);
			}
			this.removeItem(i);
		}
	},
};
