import { RUNE_USER, DESTRUCTIBLE } from 'app/game/mixins/MixinConstants';
import { sendMessage } from 'app/game/GameInterface';
import { getArrayOfLength } from 'app/utils/ArrayUtils';

export default {
	name: 'RuneUser',
	groupName: RUNE_USER,
	init: function({ attackValue, spellSlots = 40, startingSpells = [] }) {
		this._attackValue = attackValue;
		this.spells = startingSpells.concat(...getArrayOfLength(spellSlots - startingSpells.length));
	},
	cast: function(centerX, centerY, spell) {
		const targets = this.getMap().getEntitiesWithinPattern({
			centerX,
			centerY,
			depth: this.getZ(),
			pattern: spell.pattern,
		});

		targets.forEach(target => {
			// Only remove the entity if they were destructible
			if (target.hasMixin(DESTRUCTIBLE)) {
				const damage = spell.power;
				sendMessage(this, `You strike the ${target.getName()} for ${damage} damage!`);
				sendMessage(target, `The ${this.getName()} strikes you for ${damage} damage!`);

				target.takeDamage(this, damage);
			}
		});
	},
	getAttackValue: function() {
		return this._attackValue;
	},
};
