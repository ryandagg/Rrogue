export default {
    name: 'Moveable',
    tryMove: function(x, y, map) {
        const tile = map.getTile(x, y);
        // Check if we can walk on the tile
        // and if so simply walk onto it
        if (tile.isWalkable()) {
            // Update the entity's position
            this._x = x;
            this._y = y;
            return true;
            // Check if the tile is diggable, and
            // if so try to dig it
        }

        return false;
    },
};
