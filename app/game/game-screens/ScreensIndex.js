import StartScreen from './StartScreen';
import PlayScreen from './PlayScreen';
import * as SCREEN_NAMES from './ScreenNameConstants';

export default {
    [SCREEN_NAMES.PLAY_SCREEN]: PlayScreen,
    [SCREEN_NAMES.HOME_SCREEN]: StartScreen
};
