import Tile from 'app/game/objects/tile/Tile';


export const getNullTile = () => new Tile();
export const getFloorTile = () => new Tile({character: '.'});
export const getWallTile = () => new Tile({character: '#', foreground: 'goldenrod', isDiggable: true});
