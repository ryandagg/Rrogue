import Item from 'app/game/objects/Item.js';

export default class Rune extends Item {
	constructor(properties = {}) {
		const {heals, character, name, foreground, cost, power} = properties;

		super({
			...properties,
			character: character || '®',
			name: name || 'rune',
			foreground: foreground || 'green',
		});

		this._heals = heals;
		this.cost = cost;
		this.power = power;
	};
}
