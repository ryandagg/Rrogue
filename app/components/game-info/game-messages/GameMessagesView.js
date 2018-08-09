// @flow
import React from 'react';
import styles from './GameMessagesView.scss';
import {compose, shouldUpdate } from 'recompose';
import {connect} from 'react-redux';

const GameMessages = ({messages}) => {
	return (
		<div className={styles.wrapper}>
			<div>Messages:</div>
			<div className={styles.messages}>
				{messages.map((msg, index) => (<div key={`${msg}-${index}`}>{msg}</div>))}
			</div>
		</div>
	);
};

export default compose(
	connect(({gameInfo = {}}) => {
		const {messages = []} = gameInfo;
		return {messages: [...messages]}; // spreading to create a new array so that shouldUpdate actually gets fired
	}),
	shouldUpdate((props, nextProps) => {
		return props.messages.length !== nextProps.messages.length;
	}),
)(GameMessages);
