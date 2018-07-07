/* globals window */
import ROT from 'rot-js';
import {startScreen} from './game-screens/ScreensIndex';

const fontSize = 18;
const WIDTH = 90;
const HEIGHT = Math.floor(WIDTH/16*9);
const ROOM_MIN = 6;
const ROOM_MAX = 13;
const ROOM_ARG = [ROOM_MIN, ROOM_MAX];

const ROOM_CONFIG = {
    roomWidth: ROOM_ARG,
    roomHeight: ROOM_ARG,
    dugPercentage: 0.5,
    corridorLength: [1, 8],
};

const bindEventToScreen = (event, screen) => {
    window.addEventListener(event, function(e) {
        // When an event is received, send it to the
        // screen if there is one
        if (screen !== null) {
            // Send the event type and data to the screen
            screen.handleInput(event, e);
        }
    });
};

const bindAllKeypresses = (screen) => {
    bindEventToScreen('keydown', screen);
    bindEventToScreen('keyup', screen);
    bindEventToScreen('keypress', screen);
};

export default class Game {
    constructor({width, height}) {
        this._currentScreen = startScreen;

        this._display = new ROT.Display({
            width: WIDTH,
            height: HEIGHT,
            fontSize,
        });

        ROT.RNG.setSeed(1234);

        const map = new ROT.Map.Digger(WIDTH, HEIGHT, ROOM_CONFIG);

        map.create((x, y, wall) => {
            this._display.draw(x, y, wall ? '#' : '.');
        });

        const drawDoor = (x, y) => {
            this._display.draw(x, y, '', '', 'red');
        };

        map.getRooms().forEach((room) => {
            room.getDoors(drawDoor);
        });

        // Bind keyboard input events
        bindAllKeypresses(this._currentScreen);
    }

    getDisplay = () => this._display;

    getCanvasElement = () => this.getDisplay().getContainer();

    switchScreen = (screen) => {
        // If we had a screen before, notify it that we exited
        if (this._currentScreen !== null) {
            this._currentScreen.exit();
        }
        // Clear the display
        this.getDisplay().clear();
        // Update our current screen, notify it we entered
        // and then render it
        this._currentScreen = screen;
        if (!this._currentScreen !== null) {
            this._currentScreen.enter();
            this._currentScreen.render(this._display);
        }
    };
};
