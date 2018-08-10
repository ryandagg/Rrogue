import Item from 'app/game/objects/Item.js';
import {getUuid} from 'app/utils/MiscUtils';

export default class Rune extends Item {
	constructor(properties = {}) {
		const {
			heals,
			character,
			name,
			foreground,
			cost,
			power,
			multiplier,
			costModifier,
		} = properties;

		super({
			...properties,
			character: character || '®',
			name: name || 'rune',
			foreground: foreground || 'green',
		});

		this.heals = heals;
		this.cost = cost;
		this.power = power;
		this.uid = getUuid();
		this.multiplier = multiplier || 0;
		this.costModifier = costModifier || 0;
	};
}
