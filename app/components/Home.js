// @flow
/* globals document window */
import React from 'react';
import styles from './Home.css';
import { lifecycle, compose } from 'recompose';
import { initEngine, getCanvasElement } from '../game/GameInterface';
import {connect} from 'react-redux';
import PlayerStatsView from 'app/components/game-info/player-stats/PlayerStatsView';
import GameMessages from 'app/components/game-info/game-messages/GameMessagesView';

const Home = ({isPlaying}) => {
	return (
		<div>
			<div className={styles.container} data-tid="container"/>
			<div display-if={isPlaying} className={styles.hud}>
				<PlayerStatsView/>
				<GameMessages/>
			</div>
		</div>
	);
};

export default compose(
	connect(({gameInfo = {}}) => {
		return {
			isPlaying: gameInfo.isPlaying,
		};
	}),
	lifecycle({
		componentDidMount() {
			const gameRoot = document.getElementById('gameRoot');
			// delete any existing canvas elements. Only need to do this with HMR on (?)
			while (gameRoot.firstChild) {
				gameRoot.removeChild(gameRoot.firstChild);
			}
			const displayWidth = Math.min(
				Math.floor(window.innerWidth - 250),
				1024,
			);
			const displayHeight = Math.min(
				Math.floor(window.innerHeight - 250),
				728,
			);
			initEngine({ displayWidth, displayHeight});
			// Add the container to our HTML page
			gameRoot.appendChild(getCanvasElement());
		},
	}),
)(Home);
