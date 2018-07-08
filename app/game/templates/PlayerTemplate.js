import Movable from 'app/game/mixins/Movable';
import PlayerActor from 'app/game/mixins/PlayerActor';

export default {
    character: '@',
    foreground: 'white',
    background: 'black',
    mixins: [Movable, PlayerActor]
};
