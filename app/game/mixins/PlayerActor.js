import { refreshScreen } from 'app/game/GameInterface';
import { ACTOR_GROUP } from 'app/game/mixins/MixinConstants';

export default {
    name: 'PlayerActor',
    groupName: ACTOR_GROUP,
    act: () => {
        // Re-render the screen
        refreshScreen();
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        this.getMap()
            .getEngine()
            .lock();
    }
};
