import Tile from 'app/game/objects/tile/Tile';

export const getNullTile = () => new Tile();

export const getFloorTile = () => new Tile({
	character: '.',
	walkable: true,
});

export const getWallTile = () => new Tile({
	character: '#',
	foreground: 'goldenrod',
	isDiggable: true,
	blockingLight: true,
});

export const getStairsUpTile = () => new Tile({
	character: '<',
	foreground: 'purple',
	background: 'white',
	walkable: true,
	upStairs: true,
});

export const getStairsDownTile = () => new Tile({
	character: '>',
	foreground: 'blue',
	background: 'white',
	walkable: true,
	downStairs: true,
});
