// @flow
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';

type Props = {
	store: {},
	history: {}, // eslint-disable-line
};

export default class Root extends Component<Props> {
	render() {
		const {store} = this.props;
		return (
			<Provider store={store}>
				<ConnectedRouter history={this.props.history}>
					<Routes store={store}/>
				</ConnectedRouter>
			</Provider>
		);
	}
}
