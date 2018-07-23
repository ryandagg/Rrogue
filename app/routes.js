import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';

export default ({store}) => (
	<App>
		<Switch>
			<Route path="/" component={HomePage} store={store} />
		</Switch>
	</App>
);
