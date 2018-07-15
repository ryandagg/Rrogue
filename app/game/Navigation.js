import { getDisplay, setScreen, getScreen } from './GameInterface';

export const switchScreen = screen => {
	// If we had a screen before, notify it that we exited
	const currentScene = getScreen();
	if (currentScene != null) {
		currentScene.exit();
	}
	// Clear the display
	getDisplay().clear();
	// Update our current screen, notify it we entered
	// and then render it
	if (screen !== null) {
		setScreen(screen);
		screen.enter();
		screen.render();
	}
};
