import Rune from 'app/game/objects/items/Rune';
import patternRepository from 'app/game/repositories/patternRepository';

export default class TargetingRune extends Rune {
	constructor(properties) {
		super({...properties, foreground: 'blue'});
		const {patternType} = properties;
		this._pattern = patternRepository.create(patternType);
		if (!this._pattern) throw new Error(`unknown patternType type: ${patternType}`);
	};

	getpatternType = () => this._pattern;

}
