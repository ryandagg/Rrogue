import { BUMP_ATTACKER, DESTRUCTIBLE } from 'app/game/mixins/MixinConstants';

export default {
    name: 'BumpAttacker',
    groupName: BUMP_ATTACKER,
    init: function({ attackValue }) {
        this._attackValue = attackValue;
    },
    attack: function(target) {
        // Only remove the entity if they were destructible
        if (target.hasMixin(DESTRUCTIBLE)) {
            target.takeDamage(this, this.getAttackValue());
        }
    },
    getAttackValue: function() {
        return this._attackValue;
    }
};
