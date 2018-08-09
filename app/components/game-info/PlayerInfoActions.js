import {SET_PLAYER_STATE, SET_GAME_MESSAGES} from 'app/components/game-info/GameInfoReducer';


export const setPlayerState = (player) => (dispatch) => {
	const payload = {
		hp: player.getHp(),
		maxHp: player.getMaxHp(),
	};
	dispatch({type: SET_PLAYER_STATE, payload});
};


export const setGameMessages = (messages) => (dispatch) => {
	dispatch({type: SET_GAME_MESSAGES, payload: messages});
};
