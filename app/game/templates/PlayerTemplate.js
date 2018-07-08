import Movable from 'app/game/mixins/Movable';
import PlayerActor from 'app/game/mixins/PlayerActor';
import SimpleAttacker from 'app/game/mixins/SimpleAttacker';
import Destructible from 'app/game/mixins/Destructible';

export default {
    character: '@',
    foreground: 'white',
    background: 'black',
    hp: 20,
    mixins: [Movable, PlayerActor, SimpleAttacker, Destructible]
};
