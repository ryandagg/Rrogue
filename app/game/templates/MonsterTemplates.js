import * as monsterMixins from 'app/game/mixins/monsters/MonsterMixins';
import BumpAttacker from 'app/game/mixins/BumpAttacker';
import Destructible from 'app/game/mixins/Destructible';

export const fungusTemplate = {
	character: 'M',
	name: 'green fungus',
	foreground: 'green',
	hp: 5,
	mixins: [monsterMixins.FungusActor, BumpAttacker, Destructible],
};
