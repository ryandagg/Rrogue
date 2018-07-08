import * as monsterMixins from 'app/game/mixins/monsters/MonsterMixins';
import SimpleAttacker from 'app/game/mixins/SimpleAttacker';
import Destructible from 'app/game/mixins/Destructible';

export const fungusTemplate = {
    character: 'M',
    foreground: 'green',
    hp: 1,
    mixins: [monsterMixins.FungusActor, SimpleAttacker, Destructible]
};
