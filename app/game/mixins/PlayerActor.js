// import { refreshScreen } from 'app/game/GameInterface';
import { ACTOR } from 'app/game/mixins/MixinConstants';

export default {
    name: 'PlayerActor',
    groupName: ACTOR,
    act: function() {
        // Re-render the screen
        // refreshScreen();
        // Lock the engine and wait asynchronously
        // for the player to press a key.
        const engine = this.getMap().getEngine();
        engine.lock();
    }
};
