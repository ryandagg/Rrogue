import Game from './Game';

let game;

export const getDisplay = () => game.getDisplay();
export const getCanvasElement = () => game.getCanvasElement();
export const initEngine = ({width, height}) => {
    game = new Game({width, height});
};

export const setScreen = (newScreen) => {
    game.setScreen(newScreen);
};

export const getScene = () => game.getScene();


