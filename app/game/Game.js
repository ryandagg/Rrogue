/* globals window */
import ROT from 'rot-js';
import {
    DISPLAY_OPTIONS,
    EVENTS_TO_BIND,
    STARTING_SCREEN
} from 'app/game/GameConstants';
import ScreensMap from 'app/game/game-screens/ScreensIndex';

export default class Game {
    constructor({ displayWidth, displayHeight }) {
        this._display = new ROT.Display(DISPLAY_OPTIONS);
        this._displayWidth = displayWidth;
        this._displayHeight = displayHeight;
        this.switchScreen(STARTING_SCREEN);

        // Bind keyboard input events
        EVENTS_TO_BIND.forEach(eventType => this._bindEvent(eventType));
    }

    getScreen = () => this._currentScreen;

    getWindowDimensions = () => ({
        width: this._displayWidth,
        height: this._displayHeight
    });

    setScreen = scene => {
        this._currentScreen = scene;
    };

    refreshScreen = () => {
        const display = this.getDisplay();
        // Clear the display
        display.clear();
        this.getScreen().render(display);
    };

    switchScreen = screenName => {
        // If we had a screen before, notify it that we exited
        const currentScreen = this.getScreen();
        if (currentScreen != null) {
            currentScreen.exit();
        }

        const screen = new ScreensMap[screenName]();
        // Update our current screen, notify it we entered
        // and then render it
        if (screen != null) {
            this.setScreen(screen);
            // this avoids some timing issues with GameInterface init triggering other calls to GameInterface
            setTimeout(() => {
                screen.enter();
                this.refreshScreen();
            });
        }
    };

    _bindEvent = event => {
        window.addEventListener(event, e => {
            // When an event is received, send it to the
            // screen if there is one
            if (this._currentScreen != null) {
                // Send the event type and data to the screen
                this._currentScreen.handleInput(event, e);
            }
        });
    };

    getDisplay = () => this._display;

    getCanvasElement = () => this.getDisplay().getContainer();
}
