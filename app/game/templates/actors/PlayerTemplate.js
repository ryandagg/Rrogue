import Movable from 'app/game/mixins/actors/Movable';
import PlayerActor from 'app/game/mixins/actors/PlayerActor';
import BumpAttacker from 'app/game/mixins/actors/BumpAttacker';
import Destructible from 'app/game/mixins/Destructible';
import MessageRecipient from 'app/game/mixins/actors/MessageRecipient';
import Sight from 'app/game/mixins/actors/Sight';
import InventoryHolder from 'app/game/mixins/actors/InventoryHolder';

export default {
	character: '@',
	foreground: 'white',
	background: 'black',
	maxHp: 20,
	sightRadius: 6,
	mixins: [
		Movable,
		PlayerActor,
		BumpAttacker,
		Destructible,
		MessageRecipient,
		Sight,
		InventoryHolder,
	],
};
