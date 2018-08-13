import {SET_GAME_IS_PLAYING, SET_MODAL} from 'app/components/game-info/GameInfoReducer';
import {getScreen} from 'app/game/GameInterface';

export const setGamePlaying = (isPlaying) => ({type: SET_GAME_IS_PLAYING, payload: isPlaying});
export const setModalType = (modalType) => ({type: SET_MODAL, payload: modalType});
export const closeModal = () => (dispatch) => {
	dispatch(setModalType('none'));
	const gameScreen = getScreen();
	if (gameScreen && gameScreen.setSubScreen) gameScreen.setSubScreen(undefined);
};


