import Tile from 'app/game/objects/tile/Tile';


export const getNullTile = () => new Tile();
export const getFloorTile = () => new Tile('.');
export const getWallTile = () => new Tile('#', 'goldenrod');
