import Tile from './tile/Tile';

const vowels = 'aeiou';

export default class Item extends Tile {
	constructor(properties = {}) {
		super(properties);
		const {name} = properties;

		this._name = name || '';
	}

	describe = () => this._name;

	describeA = (capitalize) => {
		// Optional parameter to capitalize the a/an.
		const prefixes = capitalize ? ['A', 'An'] : ['a', 'an'];
		const string = this.describe();
		const firstLetter = string.charAt(0).toLowerCase();
		// If word starts by a vowel, use an, else use a. Note that this is not perfect.
		const prefixIndex = vowels.indexOf(firstLetter) >= 0 ? 1 : 0;

		return prefixes[prefixIndex] + ' ' + string;
	};

};
