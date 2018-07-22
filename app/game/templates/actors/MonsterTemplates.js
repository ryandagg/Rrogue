import * as monsterMixins from 'app/game/mixins/actors/monsters/MonsterMixins';
import BumpAttacker from 'app/game/mixins/actors/BumpAttacker';
import Destructible from 'app/game/mixins/Destructible';
import WanderActor from 'app/game/mixins/actors/WanderActor';

export const fungusTemplate = {
	character: 'M',
	name: 'green fungus',
	foreground: 'green',
	maxHp: 5,
	mixins: [monsterMixins.FungusActor, BumpAttacker, Destructible],
};

export const batTemplate = {
	name: 'bat',
	character: 'B',
	foreground: 'white',
	maxHp: 5,
	attackValue: 4,
	mixins: [
		WanderActor,
		BumpAttacker,
		Destructible,
	],
};

export const newtTemplate = {
	name: 'newt',
	character: 's',
	foreground: 'yellow',
	maxHp: 3,
	attackValue: 2,
	mixins: [
		WanderActor,
		BumpAttacker,
		Destructible,
	],
};
