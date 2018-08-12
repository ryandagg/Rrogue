import Tile from 'app/game/objects/tile/Tile';


const vowels = 'aeiou';

export default class DynamicTile extends Tile {
	constructor(properties = {}) {
		super(properties);
		// Instantiate any properties from the passed object
		const { name, mixins = [] } = properties;
		this.name = name || '';

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


	getName = () => this.name;
	setName = name => {
		this.name = name;
	};

	describe = () => this.name;
	describeA = (capitalize) => {
		// Optional parameter to capitalize the a/an.
		const prefixes = capitalize ? ['A', 'An'] : ['a', 'an'];
		const string = this.describe();
		const firstLetter = string.charAt(0).toLowerCase();
		// If word starts by a vowel, use an, else use a. Note that this is not perfect.
		const prefixIndex = vowels.indexOf(firstLetter) >= 0 ? 1 : 0;

		return prefixes[prefixIndex] + ' ' + string;
	};

	describeThe = (capitalize) => {
		const prefix = capitalize ? 'The' : 'the';
		return prefix + ' ' + this.describe();
	}
}
