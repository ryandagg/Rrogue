const fontSize = 18;
const DISPLAY_WIDTH = 56;
const DISPLAY_HEIGHT = Math.floor(DISPLAY_WIDTH/16*9);
const ROOM_MIN = 6;
const ROOM_MAX = 13;
const ROOM_ARG = [ROOM_MIN, ROOM_MAX];

const MAP_WIDTH = 100;
const MAP_HEIGHT = Math.floor(MAP_WIDTH/16*9);


const CELLULAR = 'Cellular';
const DIGGER = 'Digger';
const UNIFORM = 'Uniform';

export const DISPLAY_OPTIONS = {
    forceSquareRatio: true, // changes dimensions from rectangle characters to equal height/width per tile
    width: DISPLAY_WIDTH,
    height: DISPLAY_HEIGHT,
    fontSize,
};

export const MAP_SIZE = {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
};

export const MAP_GENERATOR_TYPES = {
    CELLULAR,
    DIGGER,
    UNIFORM,
};

export const MAP_GENERATOR_TYPE = CELLULAR;

const DIGGER_MAP_CONFIG = {
    roomWidth: ROOM_ARG,
    roomHeight: ROOM_ARG,
    dugPercentage: 0.5,
    corridorLength: [1, 8],
};

const UNIFORM_MAP_CONFIG = {
    roomWidth: ROOM_ARG,
    roomHeight: ROOM_ARG,
    roomDugPercentage: 0.5,
};

const CELLULAR_MAP_CONFIG = {
    fillPercent: 0.55,
    connected: true,
    topology: 8,
    createCount: 2,
    // born: [2, 5],
    // survive: [1, 1],
};

export const MAP_CONFIGS = {
    [DIGGER]: DIGGER_MAP_CONFIG,
    [CELLULAR]: CELLULAR_MAP_CONFIG,
    [UNIFORM]: UNIFORM_MAP_CONFIG,
};

export const EVENTS_TO_BIND = [
    'keydown',
    'keyup',
    'keypress',
];
