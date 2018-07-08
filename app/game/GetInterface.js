import Game from './Game';

let game;

const wrapMethod = methodName => (...args) => game[methodName](...args);

export const getDisplay = () => game.getDisplay();
export const getCanvasElement = () => game.getCanvasElement();
export const initEngine = ({ displayWidth, displayHeight }) => {
    game = new Game({ displayWidth, displayHeight });
};

export const setScreen = wrapMethod('setScreen');

export const getScene = () => wrapMethod('getScene');

export const switchScreen = wrapMethod('switchScreen');

export const getWindowDimensions = wrapMethod('getWindowDimensions');
export const refreshScreen = wrapMethod('refreshScreen');
