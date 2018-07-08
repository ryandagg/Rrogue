import { DESTRUCTIBLE } from 'app/game/mixins/MixinConstants';

export default {
	name: DESTRUCTIBLE,
	init: function({ maxHp, hp }) {
		this._hp = hp || maxHp;
		this._maxHp = maxHp;
	},
	takeDamage: function(attacker, damage) {
		this._hp -= damage;
		// If have 0 or less HP, then remove ourselves from the map
		if (this._hp <= 0) {
			this.getMap().removeEntity(this);
		}
	},
	getHp: function() {
		return this._hp;
	},
	getMaxHp: function() {
		return this._maxHp;
	},
};
