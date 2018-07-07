import {getNullTile, getFloorTile} from './tile/TileUtils';

export default class GameMap {
    constructor(tiles) {
        this._tiles = tiles;
        // cache the width and height based
        // on the length of the dimensions of
        // the tiles array
        this._width = tiles.length;
        this._height = tiles[0].length;
    }

    getWidth = () => this._width;
    getHeight = () => this._height;

    // Gets the tile for a given coordinate set
    getTile = (x, y) => {
        // Make sure we are inside the bounds. If we aren't, return
        // null tile.
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
            return getNullTile();
        } else {
            return this._tiles[x][y] || getNullTile();
        }
    };

    dig = (x, y) => {
        // If the tile is diggable, update it to a floor
        if (this.getTile(x, y).isDiggable()) {
            this._tiles[x][y] = getFloorTile();
        }
    };

    getRandomFloorPosition = () => {
        // Randomly generate a tile which is a floor
        let x, y;
        do {
            x = Math.floor(Math.random() * this._width);
            y = Math.floor(Math.random() * this._width);
        } while (!this.getTile(x, y).isWalkable());

        return {x, y};
    };
};

