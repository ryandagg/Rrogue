export default {
    name: 'Moveable',
    tryMove: function(x, y, map) {
        const tile = map.getTile(x, y);
        const target = map.getEntityAt(x, y);
        // If an entity was present at the tile, then we
        // can't move there
        if (target) {
            return false;
        } else if (tile.isWalkable()) {
            // Check if we can walk on the tile
            // and if so simply walk onto it
            // Update the entity's position
            this._x = x;
            this._y = y;
            return true;
        } /*else if (tile.isDiggable()) {
            // Check if the tile is diggable, and
            // if so try to dig it
            map.dig(x, y);
            return true;
        }*/

        return false;
    }
};
