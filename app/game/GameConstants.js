import {
    PLAY_SCREEN /*, HOME_SCREEN*/
} from 'app/game/game-screens/ScreenNameConstants';

const MAP_WIDTH = 60;
const MAP_HEIGHT = MAP_WIDTH;

// for debugging
const FONT_SIZE = 12;
const DISPLAY_WIDTH = MAP_WIDTH;

// for prod
// const FONT_SIZE = 36;
// const DISPLAY_WIDTH = 22;
const DISPLAY_HEIGHT = DISPLAY_WIDTH;
const ROOM_MIN = 6;
const ROOM_MAX = 13;
const ROOM_ARG = [ROOM_MIN, ROOM_MAX];

const CELLULAR = 'Cellular';
const DIGGER = 'Digger';
const UNIFORM = 'Uniform';

export const MAP_GENERATOR_TYPE = CELLULAR;

export const STARTING_SCREEN = PLAY_SCREEN;
// export const STARTING_SCREEN = PLAY_SCREEN;

export const DISPLAY_OPTIONS = {
    forceSquareRatio: true, // changes dimensions from rectangle characters to equal height/width per tile
    width: DISPLAY_WIDTH,
    height: DISPLAY_HEIGHT,
    fontSize: FONT_SIZE
};

export const MAP_SIZE = {
    width: MAP_WIDTH,
    height: MAP_HEIGHT
};

export const MAP_GENERATOR_TYPES = {
    CELLULAR,
    DIGGER,
    UNIFORM
};

const DIGGER_MAP_CONFIG = {
    roomWidth: ROOM_ARG,
    roomHeight: ROOM_ARG,
    dugPercentage: 0.5,
    corridorLength: [1, 8]
};

const UNIFORM_MAP_CONFIG = {
    roomWidth: ROOM_ARG,
    roomHeight: ROOM_ARG,
    roomDugPercentage: 0.5
};

const CELLULAR_MAP_CONFIG = {
    fillPercent: 0.45,
    smoothingIterations: 2 // how many times map.create is called
    // topology: 8, // default value
    // born: [2, 5], // not sure what these args do
    // survive: [1, 1],
};

export const MAP_CONFIGS = {
    [DIGGER]: DIGGER_MAP_CONFIG,
    [CELLULAR]: CELLULAR_MAP_CONFIG,
    [UNIFORM]: UNIFORM_MAP_CONFIG
};

export const EVENTS_TO_BIND = ['keydown', 'keyup', 'keypress'];
