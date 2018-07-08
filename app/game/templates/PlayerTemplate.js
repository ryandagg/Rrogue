import Movable from 'app/game/mixins/Movable';
import PlayerActor from 'app/game/mixins/PlayerActor';
import BumpAttacker from 'app/game/mixins/BumpAttacker';
import Destructible from 'app/game/mixins/Destructible';

export default {
	character: '@',
	foreground: 'white',
	background: 'black',
	level: 1,
	maxHp: 20,
	mixins: [Movable, PlayerActor, BumpAttacker, Destructible],
};
