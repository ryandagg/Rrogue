import Game from './Game';

let game;

export const getDisplay = () => game.getDisplay();
export const getCanvasElement = () => game.getCanvasElement();
export const initEngine = ({ displayWidth, displayHeight }) => {
	game = new Game({ displayWidth, displayHeight });
};

export const setScreen = (...args) => game.setScreen(...args);

export const getScreen = (...args) => game.getScreen(...args);

export const switchScreen = (...args) => game.switchScreen(...args);

export const getWindowDimensions = (...args) => game.getWindowDimensions(...args);
export const refreshScreen = (...args) => game.refreshScreen(...args);
export const sendMessage = (...args) => game.sendMessage(...args);
export const sendMessageNearby = (...args) => game.sendMessageNearby(...args);
export const setGameOver = (...args) => game.setGameOver(...args);
