import Rune from 'app/game/objects/items/Rune';
import PatternRepository from 'app/game/repositories/PatternRepository';

export default class TargetingRune extends Rune {
	constructor(properties) {
		super({...properties, foreground: 'blue'});
		const {patternType} = properties;
		this.pattern = PatternRepository.create(patternType);
		if (!this.pattern) throw new Error(`unknown patternType type: ${patternType}`);
	};
}
