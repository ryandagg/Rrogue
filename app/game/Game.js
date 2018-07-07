/* globals window */
import ROT from 'rot-js';
import {
    DISPLAY_OPTIONS,
    EVENTS_TO_BIND,
} from 'app/game/GameConstants';
import ScreensMap from 'app/game/game-screens/ScreensIndex';
import {START_SCREEN} from 'app/game/game-screens/ScreenNameConstants';


export default class Game {
    constructor(/*{displayWidth, displayHeight}*/) {
        this._display = new ROT.Display(DISPLAY_OPTIONS);

        this.switchScreen(START_SCREEN);

        // Bind keyboard input events
        EVENTS_TO_BIND.forEach(eventType => this._bindEvent(eventType));
    }

    getScreen = () => this._currentScreen;

    setScreen = (scene) => {
        this._currentScreen = scene;
    };

    switchScreen = (screenName) => {
        // If we had a screen before, notify it that we exited
        const currentScreen = this.getScreen();
        if (currentScreen != null) {
            currentScreen.exit();
        }
        // Clear the display
        this.getDisplay().clear();
        const screen = new (ScreensMap[screenName]);
        // Update our current screen, notify it we entered
        // and then render it
        if (screen != null) {
            this.setScreen(screen);
            screen.enter();
            screen.render(this.getDisplay());
        }
    };

    _bindEvent = (event) => {
        window.addEventListener(event, (e) => {
            // When an event is received, send it to the
            // screen if there is one
            if (this._currentScreen !== null) {
                // Send the event type and data to the screen
                this._currentScreen.handleInput(event, e, this.switchScreen);
            }
        });
    };

    drawDoor = (x, y) => {
        this._display.draw(x, y, '', '', 'red');
    };

    drawWalls = (x, y, wall) => {
        this._display.draw(x, y, wall ? '#' : '.');
    };

    getDisplay = () => this._display;

    getCanvasElement = () => this.getDisplay().getContainer();


};
