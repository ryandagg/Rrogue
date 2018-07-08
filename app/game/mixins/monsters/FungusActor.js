import { refreshScreen } from 'app/game/GameInterface';
import { ACTOR_GROUP } from 'app/game/mixins/MixinConstants';

export default {
    name: 'FungusActor',
    groupName: ACTOR_GROUP,
    act: () => {
        // Re-render the screen
        refreshScreen();
    }
};
