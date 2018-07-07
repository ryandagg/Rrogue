// @flow
/* globals document window */
import React from 'react';
import styles from './Home.css';
import {lifecycle, compose} from 'recompose';
import {initEngine, getCanvasElement} from '../game/GetEngine';

const Home = () => {
    return (
        <div>
            <div className={styles.container} data-tid="container" />
        </div>
    );
};

export default compose(
    lifecycle({
        componentDidMount() {
            const gameRoot = document.getElementById('gameRoot');
            // delete any existing canvas elements. Only need to do this with HMR on (?)
            while (gameRoot.firstChild) {
                gameRoot.removeChild(gameRoot.firstChild);
            }
            const width = Math.min(Math.floor(window.innerWidth - 250), 1024);
            const height = Math.min(Math.floor(window.innerHeight - 250), 728);
            initEngine({width, height});
            // Add the container to our HTML page
            gameRoot.appendChild(getCanvasElement());

        },
    }),
)(Home);
