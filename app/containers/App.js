// @flow
import React from 'react';

type Props = {
	children: React.Node, // eslint-disable-line
};

export default class App extends React.Component<Props> {
	props: Props;

	render() {
		return <div>{this.props.children}</div>;
	}
}
