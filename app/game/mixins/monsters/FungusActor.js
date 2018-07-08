import { ACTOR } from 'app/game/mixins/MixinConstants';
import { fungusTemplate } from 'app/game/templates/MonsterTemplates';
import Entity from 'app/game/objects/entities/Entity';

export default {
    name: 'FungusActor',
    groupName: ACTOR,
    // breeder: true,
    init: function() {
        this._growthsRemaining = 5;
        this._breedChance = 0.02;
    },
    act: function() {
        // Check if we are going to try growing this turn
        if (this._growthsRemaining > 0) {
            if (Math.random() <= this._breedChance) {
                // Generate the coordinates of a random adjacent square by
                // generating an offset between [-1, 0, 1] for both the x and
                // y directions. To do this, we generate a number from 0-2 and then
                // subtract 1.
                const xOffset = Math.floor(Math.random() * 3) - 1;
                const yOffset = Math.floor(Math.random() * 3) - 1;
                // Make sure we aren't trying to spawn on the same tile as us
                if (xOffset !== 0 || yOffset !== 0) {
                    // Check if we can actually spawn at that location, and if so
                    // then we grow!
                    if (
                        this.getMap().isEmptyFloor(
                            this.getX() + xOffset,
                            this.getY() + yOffset
                        )
                    ) {
                        const entity = new Entity(fungusTemplate);
                        entity.setX(this.getX() + xOffset);
                        entity.setY(this.getY() + yOffset);
                        this.getMap().addEntity(entity);
                        this._growthsRemaining--;
                    }
                }
            }
        }
    }
};
