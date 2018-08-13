import { getArrayOfLength } from 'app/utils/ArrayUtils';


export default class Spell {
	constructor({targetRune, runes, name, maxSize}) {
		this.runes = runes.concat(getArrayOfLength(maxSize).slice(runes.length));
		this.targetRune = targetRune;
		this.pattern = targetRune.pattern;
		this.name = name;
		this._updateCalcs();
	};

	getTargetPattern = () => this.pattern.pattern;

	_updateCalcs = () => {
		const targetRune = this.targetRune;

		let power = targetRune.power;
		let cost = targetRune.cost;
		let multiplier = 100 + (targetRune.multiplier || 0);
		let duplicates = {};
		let heals = false;
		this.runes.forEach((rune = {}) => {
			power += rune.power;
			cost += rune.cost;
			// only the first usage of a rune instance gets the multiplier effect
			if (!duplicates[rune.uid]) {
				multiplier += (rune.multiplier || 0);
				cost += (rune.costModifier || 0);
			}

			heals = heals || rune.heals;

			duplicates[rune.uid] = true;
		});

		this.power = Math.floor(power * multiplier / 100) * (heals ? -1 : 1);
		this.cost = cost;
	};

	setRune = (index, rune) => {
		this.runes[index] = rune;
		this._updateCalcs();
	};

}
