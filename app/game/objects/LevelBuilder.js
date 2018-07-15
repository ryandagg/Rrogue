import { MAP_GENERATOR_TYPE, MAP_GENERATOR_TYPES, MAP_SIZE, MAP_CONFIGS } from 'app/game/GameConstants';
import { getFloorTile, getNullTile, getWallTile, getStairsDownTile, getStairsUpTile } from 'app/game/objects/tile/TileUtils';
import { forEachOfLength } from 'app/utils/ArrayUtils';
import ROT from 'rot-js';
import {getRandomPositionForCondition} from 'app/game/objects/GameUtils';


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

export default class LevelBuilder {
	constructor({width, height, maxDepth}) {
		this._width = width;
		this._height = height;
		this._maxDepth = maxDepth;
		this._tiles = new Array(maxDepth);

		// Instantiate the arrays to be multi-dimension
		for (let z = 0; z < maxDepth; z++) {
			// Create a new cave at each level
			this._tiles[z] = this._generateLevel({
				depth: z,
				doUpStair: z !== 0,
				doDownStair: z !== (maxDepth - 1),
				width,
				height,
			});
		}
	}

	_generateLevel = ({depth, doUpStair = true, doDownStair = true, width, height}) => {
		let map = [];
		forEachOfLength(width, x => {
			map.push([]);
			// Add all the tiles
			forEachOfLength(height, () => {
				map[x].push(getNullTile());
			});
		});

		// todo: don't do this?
		// ROT.RNG.setSeed(1234);

		const mapConfig = MAP_CONFIGS[MAP_GENERATOR_TYPE];

		const generator = new ROT.Map[MAP_GENERATOR_TYPE](
			width,
			height,
			mapConfig,
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


		// Create stairs
		if (doUpStair) {
			const {x, y} = getRandomPositionForCondition(width, height, (x, y) => map[x][y].walkable());
			map[x][y] = getStairsUpTile();
		}

		// Create stairs
		if (doDownStair) {
			const {x, y} = getRandomPositionForCondition(width, height, (x, y) => map[x][y].walkable());
			const downStairs = getStairsDownTile();
			map[x][y] = downStairs;
		}

		return map;

	};

	getTiles = () => this._tiles;
	getMaxDepth = () => this._maxDepth;
	getWidth = () => this._width;
	getHeight = () => this._height;
};
