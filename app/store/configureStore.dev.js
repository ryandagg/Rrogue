/* @flow */
/* globals window */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import rootReducer from '../reducers';
import {setDispatch} from 'app/game/ReduxUtils';


const history = createHashHistory();

const configureStore = initialState => {
	// Redux Configuration
	const middleware = [];
	const enhancers = [];

	// Thunk Middleware
	middleware.push(thunk);

	// Router Middleware
	const router = routerMiddleware(history);
	middleware.push(router);

	// Redux DevTools Configuration
	const actionCreators = {
		...routerActions,
	};
	// If Redux DevTools Extension is installed use it, otherwise use Redux compose
	/* eslint-disable no-underscore-dangle */
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
		? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
				// Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
				actionCreators,
		  })
		: compose;
	/* eslint-enable no-underscore-dangle */

	// Apply Middleware & Compose Enhancers
	enhancers.push(applyMiddleware(...middleware));
	const enhancer = composeEnhancers(...enhancers);

	// Create Store
	const store = createStore(rootReducer, initialState, enhancer);
	setDispatch(store.dispatch);

	if (module.hot) {
		module.hot.accept(
			'../reducers',
			() => store.replaceReducer(require('../reducers')), // eslint-disable-line global-require
		);
	}

	return store;
};

export default { configureStore, history };
