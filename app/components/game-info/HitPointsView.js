// @flow
import React from 'react';
import styles from './HitPointsView.scss';
import {compose } from 'recompose';
import {connect} from 'react-redux';

const HitPointsView = ({currentHp, maxHp}) => {
	return (
		<div>
			<div className={styles.hpWrapper}>{currentHp}/{maxHp}</div>
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
)(HitPointsView);
