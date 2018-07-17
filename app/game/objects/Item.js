import Tile from './tile/Tile';

export default class Item extends Tile {
	constructor(properties = {}) {
		super(properties);
		const {name} = properties;

		this._name = name || '';
	}
	
};
