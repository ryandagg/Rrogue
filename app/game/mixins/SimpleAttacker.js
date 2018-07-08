import { ATTACKER, DESTRUCTIBLE } from 'app/game/mixins/MixinConstants';

export default {
    name: 'SimpleAttacker',
    groupName: ATTACKER,
    attack: function(target) {
        // Only remove the entity if they were attackable
        if (target.hasMixin(DESTRUCTIBLE)) {
            target.takeDamage(this, 1);
        }
    }
};
