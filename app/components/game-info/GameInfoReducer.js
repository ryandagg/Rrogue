export const SET_PLAYER_STATE = 'PLAYER/SET_PLAYER_STATE';
export const SET_GAME_IS_PLAYING = 'GAME/SET_GAME_IS_PLAYING';

export default (initialState = {}, {type, payload}) => {
	switch (type) {
		case SET_PLAYER_STATE: {
			return {...initialState, player: payload};
		}
		case SET_GAME_IS_PLAYING: {
			return {...initialState, isPlaying: payload};
		}
		default:
			return initialState;
	}
};
