import { DESTRUCTIBLE, PLAYER_ACTOR } from 'app/game/mixins/MixinConstants';
import { sendMessage } from 'app/game/GameInterface';

export default {
	name: DESTRUCTIBLE,
	init: function({ maxHp, hp }) {
		this._hp = hp || maxHp;
		this._maxHp = maxHp || hp;
	},
	takeDamage: function(attacker, damage) {
		this._hp = Math.min(this._hp - damage, this._maxHp); // account for healing
		// If have 0 or less HP, then remove ourselves from the map
		if (this._hp <= 0) {
			if (this.hasMixin(PLAYER_ACTOR)) {
				sendMessage(this, 'You die!');
			} else {
				sendMessage(attacker, `You kill the ${this.getName()}!`);
			}

			this.kill();

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
