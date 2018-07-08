import ROT from 'rot-js';
import { PLAY_SCREEN } from 'app/game/game-screens/ScreenNameConstants';
import { switchScreen } from 'app/game/GameInterface';

export default class PlayScreen {
	enter = () => {
		// console.log('Entered start screen.');
	};
	exit = () => {
		// console.log('Exited start screen.');
	};
	render = display => {
		// Render our prompt to the screen
		display.drawText(1, 1, '%c{yellow}Javascript Roguelike');
		display.drawText(1, 2, 'Press [Enter] to start!');
	};
	handleInput = (inputType, inputData) => {
		// When [Enter] is pressed, go to the play screen
		if (inputType === 'keydown') {
			if (inputData.keyCode === ROT.VK_RETURN) {
				switchScreen(PLAY_SCREEN);
			}
		}
	};
}
