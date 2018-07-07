const fontSize = 16;
const WIDTH = 90;
const HEIGHT = Math.floor(WIDTH/16*9);
const ROOM_MIN = 6;
const ROOM_MAX = 13;
const ROOM_ARG = [ROOM_MIN, ROOM_MAX];


const CELLULAR = 'Cellular';
const DIGGER = 'Digger';
const UNIFORM = 'Uniform';

export const DISPLAY_OPTIONS = {
    forceSquareRatio: true, // changes dimensions from rectangle characters to equal height/width per tile
    width: WIDTH,
    height: HEIGHT,
    fontSize,
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
