import Game from './Game';

let game;

export const getDisplay = () => game.getDisplay();
export const getCanvasElement = () => game.getCanvasElement();
export const initEngine = ({displayWidth, displayHeight}) => {
    game = new Game({displayWidth, displayHeight});
};

export const setScreen = (newScreen) => {
    game.setScreen(newScreen);
};

export const getScene = () => game.getScreen();

export const switchScreen = (...args) => game.switchScreen(...args);

export const getWindowDimensions = () => game.getWindowDimensions();


