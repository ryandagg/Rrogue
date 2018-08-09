

export default class Spell {
	constructor({targetRune, runes}) {
		this._runes = runes;
		this._targetRune = targetRune;

	};

	getPattern = () => this._targetRune.getPattern();
}
