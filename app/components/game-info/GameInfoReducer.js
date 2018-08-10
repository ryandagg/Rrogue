export const SET_PLAYER_STATE = 'PLAYER/SET_PLAYER_STATE';
export const SET_GAME_IS_PLAYING = 'GAME/SET_GAME_IS_PLAYING';
export const SET_GAME_MESSAGES = 'GAME/SET_GAME_MESSAGES';
export const SET_MODAL = 'GAME/SET_MODAL';

const defaultState = {
	isPlaying: false,
};

export default (initialState = defaultState, {type, payload}) => {
	switch (type) {
		case SET_PLAYER_STATE: {
			return {...initialState, player: payload};
		}
		case SET_GAME_IS_PLAYING: {
			return {...initialState, isPlaying: payload};
		}
		case SET_MODAL: {
			return {...initialState, modalType: payload};
		}
		case SET_GAME_MESSAGES: {
			return {...initialState, messages: payload};
		}
		default:
			return initialState;
	}
};
