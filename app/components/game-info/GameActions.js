import {SET_GAME_IS_PLAYING} from 'app/components/game-info/GameInfoReducer';

export const setGamePlaying = (isPlaying) => ({type: SET_GAME_IS_PLAYING, payload: isPlaying});
