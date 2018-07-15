import Movable from 'app/game/mixins/Movable';
import PlayerActor from 'app/game/mixins/PlayerActor';
import BumpAttacker from 'app/game/mixins/BumpAttacker';
import Destructible from 'app/game/mixins/Destructible';
import MessageRecipient from 'app/game/mixins/MessageRecipient';

export default {
	character: '@',
	foreground: 'white',
	background: 'black',
	maxHp: 20,
	mixins: [
		Movable,
		PlayerActor,
		BumpAttacker,
		Destructible,
		MessageRecipient,
	],
};
