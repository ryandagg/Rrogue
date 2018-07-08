import { DESTRUCTIBLE } from 'app/game/mixins/MixinConstants';

export default {
    name: DESTRUCTIBLE,
    init: function() {
        this._hp = 1;
    },
    takeDamage: function(attacker, damage) {
        this._hp -= damage;
        // If have 0 or less HP, then remove ourselves from the map
        if (this._hp <= 0) {
            this.getMap().removeEntity(this);
        }
    },
    getHp: () => this._hp
};
