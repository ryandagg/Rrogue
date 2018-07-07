import ROT from 'rot-js';
import { DISPLAY_OPTIONS, MAP_GENERATOR_TYPES, MAP_CONFIGS, MAP_GENERATOR_TYPE } from '../GameConstants';
import {getNullTile, getFloorTile, getWallTile} from 'app/game/objects/tile/TileUtils';
import GameMap from 'app/game/objects/GameMap';
import {forEachOfLength} from 'app/utils/ArrayUtils';


const drawWalls = (x, y, wall, display) => {
    this.display.draw(x, y, wall ? '#'  : '.');
};

const pickTile = (x,y,v) => {
    if (v === 1) {
        return getFloorTile();
    }

    return getWallTile();
};

const generateMap = (map => (x,y,v) => {
    map[x][y] = pickTile(x,y,v);
});

export default class PlayScreen {
    _map = null;

    enter = () => {
        let map = [];
        forEachOfLength(DISPLAY_OPTIONS.width, (x) => {
            map.push([]);
            // Add all the tiles
            forEachOfLength(DISPLAY_OPTIONS.height, () => {
                map[x].push(getNullTile());
            });
        });


        ROT.RNG.setSeed(1234);

        const mapConfig = MAP_CONFIGS[MAP_GENERATOR_TYPE];

        const generator = new ROT.Map[MAP_GENERATOR_TYPE](DISPLAY_OPTIONS.width, DISPLAY_OPTIONS.height, mapConfig);

        if (MAP_GENERATOR_TYPE === MAP_GENERATOR_TYPES.CELLULAR) {
            // smooth map
            generator.randomize(mapConfig.fillPercent);
            for (let i = 0; i < mapConfig.createCount; i++) {
                generator.create();
            }
            // make all open spaces reachable
            generator.connect(generateMap(map));
        } else {
            generator.create(generateMap(map));

            // todo = eh?
            // generator.getRooms().forEach((room) => {
            //     room.getDoors(this.drawDoor);
            // });
        }

        // Create our map from the tiles
        this._map = new GameMap(map);


    };
    exit = function() {
        console.log('Exited start screen.');

    };
    render = function(display) {
        forEachOfLength(this._map.getWidth(), (x) => {
            // Add all the tiles
            forEachOfLength(this._map.getHeight(), (y) => {
                const glyph = this._map.getTile(x, y);
                display.draw(x, y,
                    glyph.getChar(),
                    glyph.getForeground(),
                    glyph.getBackground());
            });
        });
    };
    handleInput = (inputType, inputData) => {
        if (inputType === 'keydown') {
            // if (inputData.keyCode === ROT.VK_RETURN) {
            //     this.switchScreen(Game.Screen.playScreen);
            // }
        }
    };
};
