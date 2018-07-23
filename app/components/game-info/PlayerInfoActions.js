import {SET_PLAYER_STATE} from 'app/components/game-info/GameInfoReducer';


export const setPlayerState = (player) => (dispatch) => {
	dispatch({type: SET_PLAYER_STATE, payload: player});
};
