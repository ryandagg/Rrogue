import ROT from 'rot-js';
import { DISPLAY_OPTIONS, MAP_GENERATOR_TYPES, MAP_CONFIGS, MAP_GENERATOR_TYPE, MAP_SIZE } from '../GameConstants';
import {getNullTile, getFloorTile, getWallTile} from 'app/game/objects/tile/TileUtils';
import GameMap from 'app/game/objects/GameMap';
import {forEachOfLength} from 'app/utils/ArrayUtils';
import {getDisplay} from 'app/game/GetInterface';
import Entity from 'app/game/objects/entities/Entity';
import playerTemplate from 'app/game/templates/PlayerTemplate';


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
    _player = null;

    move = (dX, dY) => {
        // // Positive dX means movement right
        // // negative means movement left
        // // 0 means none
        // this._centerX = Math.max(0,
        //     Math.min(this._map.getWidth() - 1, this._centerX + dX));
        // // Positive dY means movement down
        // // negative means movement up
        // // 0 means none
        // this._centerY = Math.max(0,
        //     Math.min(this._map.getHeight() - 1, this._centerY + dY));
        const newX = this._player.getX() + dX;
        const newY = this._player.getY() + dY;

        // Try to move to the new cell
        if (this._player.tryMove(newX, newY, this._map)) this.render(getDisplay());
    };

    enter = () => {
        let map = [];
        forEachOfLength(MAP_SIZE.width, (x) => {
            map.push([]);
            // Add all the tiles
            forEachOfLength(MAP_SIZE.height, () => {
                map[x].push(getNullTile());
            });
        });

        // todo: don't do this?
        ROT.RNG.setSeed(1234);

        const mapConfig = MAP_CONFIGS[MAP_GENERATOR_TYPE];

        const generator = new ROT.Map[MAP_GENERATOR_TYPE](MAP_SIZE.width, MAP_SIZE.height, mapConfig);

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

        // Create our player and set the position
        this._player = new Entity(playerTemplate);
        const position = this._map.getRandomFloorPosition();
        this._player.setX(position.x);
        this._player.setY(position.y);
    };

    exit = function() {
        console.log('Exited start screen.');

    };

    render = (display) => {
        const screenWidth = DISPLAY_OPTIONS.width;
        const screenHeight = DISPLAY_OPTIONS.height;
        // Make sure the x-axis doesn't go to the left of the left bound
        // Make sure we still have enough space to fit an entire game screen
        const topLeftX = Math.min(
            Math.max(0, Math.floor(this._player.getX() - (screenWidth / 2))),
            this._map.getWidth() - screenWidth
        );
        // Make sure the y-axis doesn't above the top bound
        // Make sure we still have enough space to fit an entire game screen
        const topLeftY = Math.min(
            Math.max(0, Math.floor(this._player.getY() - (screenHeight / 2))),
            this._map.getHeight() - screenHeight
        );

        forEachOfLength(DISPLAY_OPTIONS.width, (x) => {
            // Add all the tiles
            const offsetX = x + topLeftX;
            forEachOfLength(DISPLAY_OPTIONS.height, (y) => {
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
        let doRender = false;
        if (inputType === 'keydown') {
            // Movement
            switch (inputData.keyCode) {
                case ROT.VK_LEFT:
                    this.moveW();
                    doRender = true;
                    break;
                case ROT.VK_RIGHT:
                    this.moveE();
                    doRender = true;
                    break;
                case ROT.VK_UP:
                    this.moveN();
                    doRender = true;
                    break;
                case ROT.VK_DOWN:
                    this.moveS();
                    doRender = true;
                    break;
                default:
                    break;
            }
        }

    };
};
