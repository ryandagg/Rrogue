import ROT from 'rot-js';
import { HOME_SCREEN } from 'app/game/game-screens/ScreenNameConstants';
import { switchScreen } from 'app/game/GameInterface';

export default class GameOverScreen {
	enter = () => {
		// console.log('Entered start screen.');
	};
	exit = () => {
		// console.log('Exited start screen.');
	};
	render = display => {
		// Render our prompt to the screen
		display.drawText(1, 1, '%c{yellow}Ya Dead');
		display.drawText(1, 3, 'Sucks to be a dumb-dumb');
		display.drawText(1, 2, 'Press [Enter] to start!');
	};
	handleInput = (inputType, inputData) => {
		// When [Enter] is pressed, go to the play screen
		if (inputType === 'keydown') {
			if (inputData.keyCode === ROT.VK_RETURN) {
				switchScreen(HOME_SCREEN);
			}
		}
	};
}
