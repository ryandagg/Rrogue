import { MOVABLE, BUMP_ATTACKER } from 'app/game/mixins/MixinConstants';
import {sendMessage} from 'app/game/GameInterface';


export default {
	name: MOVABLE,
	tryMove: function(x, y, z, map) {
		const tile = map.getTile(x, y, this.getZ());
		const target = map.getEntityAt(x, y, this.getZ());
		// If our z level changed, check if we are on stair
		if (z < this.getZ()) {
			if (tile.upStairs()) {
				this.setPosition(x, y, z);
				sendMessage(this, `You ascend to level ${z + 1}!`);
				return true;
			} else {
				sendMessage(this, "You can't go up here!");
			}
		} else if (z > this.getZ()) {
			if (tile.downStairs()) {
				this.setPosition(x, y, z);
				sendMessage(this, `You descend to level ${z + 1}!`);
				return true;
			} else {
				sendMessage(this, "You can't go down here!");
			}
		} else if (target && target !== this) { // don't attack yourself
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
			this.setPosition(x, y, z);
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
