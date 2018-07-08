import ROT from 'rot-js';
import {
    DISPLAY_OPTIONS,
    MAP_GENERATOR_TYPES,
    MAP_CONFIGS,
    MAP_GENERATOR_TYPE,
    MAP_SIZE
} from '../GameConstants';
import {
    getNullTile,
    getFloorTile,
    getWallTile
} from 'app/game/objects/tile/TileUtils';
import GameMap from 'app/game/objects/GameMap';
import { forEachOfLength } from 'app/utils/ArrayUtils';
import { getDisplay } from 'app/game/GetInterface';
import Entity from 'app/game/objects/entities/Entity';
import playerTemplate from 'app/game/templates/PlayerTemplate';

const pickTile = (x, y, wall) => {
    if (wall === 1) {
        return getFloorTile();
    }

    return getWallTile();
};

const makeOuterWallsSolid = generator => (x, y) => {
    // surround outside of map with walls
    if (
        x === 0 ||
        x === MAP_SIZE.width - 1 ||
        y === 0 ||
        y === MAP_SIZE.height - 1
    ) {
        generator.set(x, y, 0);
    }
};

const updateMap = map => (x, y, wall) => {
    map[x][y] = pickTile(x, y, wall);
};

export default class PlayScreen {
    _map = null;
    _player = null;

    move = (dX, dY) => {
        const newX = this._player.getX() + dX;
        const newY = this._player.getY() + dY;

        // Try to move to the new cell
        if (this._player.tryMove(newX, newY, this._map))
            this.render(getDisplay());
    };

    enter = () => {
        let map = [];
        forEachOfLength(MAP_SIZE.width, x => {
            map.push([]);
            // Add all the tiles
            forEachOfLength(MAP_SIZE.height, () => {
                map[x].push(getNullTile());
            });
        });

        // todo: don't do this?
        ROT.RNG.setSeed(1234);

        const mapConfig = MAP_CONFIGS[MAP_GENERATOR_TYPE];

        const generator = new ROT.Map[MAP_GENERATOR_TYPE](
            MAP_SIZE.width,
            MAP_SIZE.height,
            mapConfig
        );

        if (MAP_GENERATOR_TYPE === MAP_GENERATOR_TYPES.CELLULAR) {
            // smooth map
            generator.randomize(mapConfig.fillPercent);
            for (let i = 0; i < mapConfig.smoothingIterations - 1; i++) {
                generator.create();
            }
            generator.create(makeOuterWallsSolid(generator));

            // make all open spaces reachable
            generator.connect(updateMap(map), 1);
        } else {
            generator.create(updateMap(map));

            // // todo: eh?
            // generator.getRooms().forEach((room) => {
            //     room.getDoors(this.drawDoor);
            // });
        }

        // Create our map from the tiles
        this._map = new GameMap(map);

        // Create our player and set the position
        this._player = new Entity(playerTemplate);
        const position = this._map.getRandomFloorPosition();
        this._player.setX(position.x);
        this._player.setY(position.y);
    };

    exit = function() {
        console.log('Exited start screen.');
    };

    render = display => {
        const screenWidth = DISPLAY_OPTIONS.width;
        const screenHeight = DISPLAY_OPTIONS.height;
        // Make sure the x-axis doesn't go to the left of the left bound
        // Make sure we still have enough space to fit an entire game screen
        // const topLeftX = Math.min(
        //     Math.max(0, Math.floor(this._player.getX() - screenWidth / 2)),
        //     this._map.getWidth() - screenWidth
        // );
        const topLeftX = Math.floor(this._player.getX() - screenWidth / 2);
        // Make sure the y-axis doesn't above the top bound
        // Make sure we still have enough space to fit an entire game screen
        // const topLeftY = Math.min(
        //     Math.max(0, Math.floor(this._player.getY() - screenHeight / 2)),
        //     this._map.getHeight() - screenHeight
        // );
        const topLeftY = Math.floor(this._player.getY() - screenHeight / 2);

        forEachOfLength(DISPLAY_OPTIONS.width, x => {
            // Add all the tiles
            const offsetX = x + topLeftX;
            forEachOfLength(DISPLAY_OPTIONS.height, y => {
                const offsetY = y + topLeftY;
                const glyph = this._map.getTile(offsetX, offsetY);
                display.draw(
                    x,
                    y,
                    glyph.getChar(),
                    glyph.getForeground(),
                    glyph.getBackground()
                );
            });
        });

        // Render the player
        display.draw(
            this._player.getX() - topLeftX,
            this._player.getY() - topLeftY,
            this._player.getChar(),
            this._player.getForeground(),
            this._player.getBackground()
        );
    };

    moveN = () => this.move(0, -1);
    moveS = () => this.move(0, 1);
    moveE = () => this.move(1, 0);
    moveW = () => this.move(-1, 0);
    moveNW = () => this.move(-1, -1);
    moveNE = () => this.move(1, -1);
    moveSW = () => this.move(-1, 1);
    moveSE = () => this.move(1, 1);

    handleInput = (inputType, inputData) => {
        if (inputType === 'keydown') {
            // Movement
            switch (inputData.keyCode) {
                // traditional roguelike bindings
                case ROT.VK_H:
                    this.moveW();
                    break;
                case ROT.VK_L:
                    this.moveE();
                    break;
                case ROT.VK_K:
                    this.moveN();
                    break;
                case ROT.VK_J:
                    this.moveS();
                    break;
                case ROT.VK_Y:
                    this.moveNW();
                    break;
                case ROT.VK_U:
                    this.moveNE();
                    break;
                case ROT.VK_B:
                    this.moveSW();
                    break;
                case ROT.VK_N:
                    this.moveSE();
                    break;
                default:
                    break;
            }
        }
    };
}
