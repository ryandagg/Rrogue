import { BUMP_ATTACKER, DESTRUCTIBLE } from 'app/game/mixins/MixinConstants';
import { sendMessage } from 'app/game/GameInterface';

export default {
	name: 'BumpAttacker',
	groupName: BUMP_ATTACKER,
	init: function({ attackValue }) {
		this._attackValue = attackValue;
	},
	attack: function(target) {
		// Only remove the entity if they were destructible
		if (target.hasMixin(DESTRUCTIBLE)) {
			const damage = this.getAttackValue();
			sendMessage(this, `You strike the ${target.getName()} for ${damage} damage!`);
			sendMessage(target, `The ${this.getName()} strikes you for ${damage} damage!`);

			target.takeDamage(this, damage);
		}
	},
	getAttackValue: function() {
		return this._attackValue;
	},
};
