// @flow
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import {setDispatch} from 'app/game/ReduxUtils';

const history = createHashHistory();
const router = routerMiddleware(history);
const enhancer = applyMiddleware(thunk, router);

function configureStore(initialState) {
	const store = createStore(rootReducer, initialState, enhancer);
	setDispatch(store.dispatch);
	return store;
}

export default { configureStore, history };
