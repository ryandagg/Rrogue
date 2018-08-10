import {SET_GAME_IS_PLAYING, SET_MODAL} from 'app/components/game-info/GameInfoReducer';

export const setGamePlaying = (isPlaying) => ({type: SET_GAME_IS_PLAYING, payload: isPlaying});
export const setModalType = (type) => ({type: SET_MODAL, payload: type});
export const closeModal = () => setModalType('');


