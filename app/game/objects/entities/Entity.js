import { getEntityKey } from 'app/game/objects/GameUtils';
import Tile from 'app/game/objects/tile/Tile';

export default class Entity extends Tile {
	constructor(properties = {}) {
		super(properties);
		// Instantiate any properties from the passed object
		const { x, y, z, name, mixins = [] } = properties;
		this._name = name || '';
		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;

		this._map = null;

		this._attachedMixins = {};

		// Create a similar object for groups
		this._attachedMixinGroups = {};

		// Setup the object's mixins
		mixins.forEach(mixin => {
			// Copy over all properties from each mixin as long
			// as it's not the name or the init property. We
			// also make sure not to override a property that
			// already exists on the entity.
			Object.keys(mixin).forEach(key => {
				if (
					key !== 'init' &&
					key !== 'name' &&
					!this.hasOwnProperty(key)
				) {
					this[key] = mixin[key];
				}
			});

			// Add the name of this mixin to our attached mixins
			this._attachedMixins[mixin.name] = true;
			// If a group name is present, add it
			if (mixin.groupName) {
				this._attachedMixinGroups[mixin.groupName] = true;
			}

			// Finally call the init function if there is one
			if (mixin.init) {
				mixin.init.call(this, properties);
			}
		});
	}

	hasMixin = lookup => {
		// Allow passing the mixin itself or the name as a string
		if (typeof lookup === 'object') {
			return this._attachedMixins[lookup.name];
		} else {
			return (
				this._attachedMixins[lookup] ||
				this._attachedMixinGroups[lookup]
			);
		}
	};

	getName = () => this._name;
	setName = name => {
		this._name = name;
	};

	getX = () => this._x;
	setX = x => {
		this._x = x;
	};

	getY = () => this._y;
	setY = y => {
		this._y = y;
	};

	getZ = () => this._z;
	setZ = z => {
		this._z = z;
	};

	setPosition = (x, y, z) => {
		const oldX = this._x;
		const oldY = this._y;
		const oldZ = this._z;

		// Update position
		this._x = x;
		this._y = y;
		this._z = z;

		if (this._map) {
			this._map.updateEntityPosition(this, oldX, oldY, oldZ);
		}

	};

	setMap = map => (this._map = map);
	getMap = () => this._map;

	getKey = () => getEntityKey(this.getX(), this.getY())
}
