// @flow
import React from 'react';
import styles from './PlayerStatsView.scss';
import {compose } from 'recompose';
import {connect} from 'react-redux';

const PlayerStatsView = ({currentHp, maxHp}) => {
	return (
		<div display-if={currentHp != null}>
			<div className={styles.hpWrapper}>HP: {currentHp}/{maxHp}</div>
		</div>
	);
};

export default compose(
	connect(({gameInfo = {}}) => {
		const {player = {}} = gameInfo;
		return {
			currentHp: player.hp,
			maxHp: player.maxHp,
		};
	})
)(PlayerStatsView);
