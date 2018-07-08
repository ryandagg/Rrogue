import { DESTRUCTIBLE } from 'app/game/mixins/MixinConstants';
import {sendMessage} from 'app/game/GameInterface';

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
            sendMessage(attacker, 'You kill the %s!', [this.getName()]);
            sendMessage(this, 'You die!');

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
