import Tile from 'app/game/objects/tile/Tile';

export const getNullTile = () => new Tile();
export const getFloorTile = () => new Tile({ character: '.', walkable: true });
export const getWallTile = () => new Tile({
	character: '#',
	foreground: 'goldenrod',
	isDiggable: true,
});
export const getStairsUpTile = () => new Tile({
	character: '<',
	foreground: 'goldenrod',
	isDiggable: true,
});
export const getStairsDownTile = () => new Tile({
	character: '>',
	foreground: 'goldenrod',
	isDiggable: true,
});
