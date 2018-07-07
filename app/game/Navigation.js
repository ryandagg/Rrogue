import {getDisplay, setScreen, getScene} from './GetInterface';

export const switchScreen = (screen) => {
    // If we had a screen before, notify it that we exited
    const currentScene = getScene();
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
