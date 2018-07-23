// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import gameInfo from 'app/components/game-info/GameInfoReducer';

const rootReducer = combineReducers({
	router,
	gameInfo,
});

export default rootReducer;
