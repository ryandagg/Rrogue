

export default class Spell {
	constructor({targetRune, runes}) {
		this._runes = runes;
		this._targetRune = targetRune;
		this.pattern = targetRune.pattern;
		let power = targetRune.power;
		let cost = targetRune.cost;
		let multiplier = 100 + (targetRune.multiplier || 0);
		let duplicates = {};
		let heals = false;
		runes.forEach(rune => {
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

	getTargetPattern = () => this.pattern.pattern
}
