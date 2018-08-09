import Movable from 'app/game/mixins/actors/Movable';
import PlayerActor from 'app/game/mixins/actors/PlayerActor';
import BumpAttacker from 'app/game/mixins/actors/BumpAttacker';
import Destructible from 'app/game/mixins/Destructible';
import MessageRecipient from 'app/game/mixins/actors/MessageRecipient';
import Sight from 'app/game/mixins/actors/Sight';
import InventoryHolder from 'app/game/mixins/actors/InventoryHolder';
import Spell from 'app/game/objects/Spells';
import TargetingRune from 'app/game/objects/items/TargetingRune';
import Rune from 'app/game/objects/items/Rune';
import {SINGLE} from 'app/game/repositories/PatternRepository';


const startingInventory = [
	new TargetingRune({patternType: SINGLE}),
	new Rune({power: 4, cost: 2}),
	new Rune({power: 7, cost: 4}),
];

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
	startingInventory,
	startingSpells: [
		new Spell({
			targetRune: startingInventory[0],
			runes: [
				startingInventory[1],
				startingInventory[1],
			],
			name: 'weak sauce',
		}),
		new Spell({
			targetRune: startingInventory[0],
			runes: [
				startingInventory[2],
				startingInventory[2],
			],
			name: 'hot sauce',
		}),
	],
};
