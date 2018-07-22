import StartScreen from './StartScreen';
import PlayScreen from './PlayScreen';
import GameOverScreen from './GameOverScreen';
import ItemListScreen from './ItemListScreen';
import * as SCREEN_NAMES from './ScreenNameConstants';

export default {
	[SCREEN_NAMES.PLAY_SCREEN]: PlayScreen,
	[SCREEN_NAMES.HOME_SCREEN]: StartScreen,
	[SCREEN_NAMES.GAME_OVER_SCREEN]: GameOverScreen,
	[SCREEN_NAMES.ITEM_LIST_SUB_SCREEN]: ItemListScreen,
};
