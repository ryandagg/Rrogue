import { MOVABLE, BUMP_ATTACKER } from 'app/game/mixins/MixinConstants';

export default {
    name: MOVABLE,
    tryMove: function(x, y, map) {
        const tile = map.getTile(x, y);
        const target = map.getEntityAt(x, y);
        // If an entity was present at the tile, then we
        // can't move there
        if (target) {
            // If we are an attacker, try to attack
            // the target
            if (this.hasMixin(BUMP_ATTACKER)) {
                this.attack(target);
                return true;
            } else {
                // If not nothing we can do, but we can't
                // move to the tile
                return false;
            }
        } else if (tile.walkable()) {
            // Check if we can walk on the tile
            // and if so simply walk onto it
            // Update the entity's position
            this._x = x;
            this._y = y;
            return true;
        } /*else if (tile.diggable()) {
            // Check if the tile is diggable, and
            // if so try to dig it
            map.dig(x, y);
            return true;
        }*/

        return false;
    },
};
