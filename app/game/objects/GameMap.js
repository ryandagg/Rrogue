import { getNullTile, getFloorTile } from './tile/TileUtils';
import ROT from 'rot-js';
import { forEachOfLength } from 'app/utils/ArrayUtils';
import Entity from 'app/game/objects/entities/Entity';
import { fungusTemplate } from 'app/game/templates/MonsterTemplates';
import { ACTOR } from 'app/game/mixins/MixinConstants';
import {getRandomPositionForCondition} from 'app/game/objects/GameUtils';

export default class GameMap {
	constructor(tiles, player) {
		this._tiles = tiles;
		// cache the width and height based
		// on the length of the dimensions of
		// the tiles array
		this._width = tiles[0].length;
		this._height = tiles[0][0].length;
		this._depth = tiles.length;

		this._fov = [];
		// create a list which will hold the entities
		this._entities = [];
		// create the engine and scheduler
		this._scheduler = new ROT.Scheduler.Simple();
		this._engine = new ROT.Engine(this._scheduler);

		// add the player
		this.addEntityAtRandomPosition(player, 0);
		this.populateMonsters(0);
		// setup the field of visions
		this.setupFov();
	}

	getWidth = () => this._width;
	getHeight = () => this._height;
	getDepth = () => this._depth;

	// Gets the tile for a given coordinate set
	getTile = (x, y, z) => {
		// Make sure we are inside the bounds. If we aren't, return
		// null tile.
		if (x < 0 || x >= this._width || y < 0 || y >= this._height ||
			z < 0 || z >= this._depth) {
			return getNullTile();
		} else {
			return this._tiles[z][x][y] || getNullTile();
		}
	};

	// no safety check. make sure you want to do this
	setTile = (x, y, z, tile) => {
		this._tiles[z][x][y] = tile;
	};

	dig = (x, y, z) => {
		// If the tile is diggable, update it to a floor
		if (this.getTile(x, y, z).diggable()) {
			this._tiles[z][x][y] = getFloorTile();
		}
	};

	isEmptyFloor = (x, y, z) => {
		const tile = this.getTile(x, y, z);
		// Check if the tile is floor and also has no entity
		return tile && tile.walkable() && !this.getEntityAt(x, y, z);
	};

	getRandomFloorPosition = (z) => getRandomPositionForCondition(
		this._width,
		this._height,
		(x, y) => this.isEmptyFloor(x, y, z),
	);

	getEngine = () => this._engine;

	/** entities **/
	getEntities = () => this._entities;

	getEntityAt = (x, y, z) =>
		this._entities.find(
			entity => entity.getX() === x && entity.getY() === y && entity.getZ() === z,
		) || false;

	addEntity = entity => {
		// Make sure the entity's position is within bounds
		if (
			entity.getX() < 0 ||
			entity.getX() >= this._width ||
			entity.getY() < 0 ||
			entity.getY() >= this._height ||
			entity.getZ() < 0 || entity.getZ() >= this._depth
		) {
			throw new Error('Adding entity out of bounds.');
		}
		// Update the entity's map
		entity.setMap(this);
		// Add the entity to the list of entities
		this._entities.push(entity);
		// Check if this entity is an actor, and if so add
		// them to the scheduler
		if (entity.hasMixin(ACTOR)) {
			this._scheduler.add(entity, true);
		}
	};

	removeEntity = entity => {
		// Find the entity in the list of entities if it is present
		for (let i = 0; i < this._entities.length; i++) {
			if (this._entities[i] === entity) {
				this._entities.splice(i, 1);
				break;
			}
		}
		// If the entity is an actor, remove them from the scheduler
		if (entity.hasMixin(ACTOR)) {
			this._scheduler.remove(entity);
		}
	};

	addEntityAtRandomPosition = (entity, z) => {
		const { x, y } = this.getRandomFloorPosition(z);
		entity.setX(x);
		entity.setY(y);
		entity.setZ(z);
		this.addEntity(entity);
	};

	populateMonsters = (z) => {
		forEachOfLength(25, () =>
			this.addEntityAtRandomPosition(new Entity(fungusTemplate), z),
		);
	};

	getEntitiesWithinRadius = ({centerX, centerY, depth, radius}) => {
		// Determine our bounds
		const leftX = centerX - radius;
		const rightX = centerX + radius;
		const topY = centerY - radius;
		const bottomY = centerY + radius;
		// Iterate through our entities, adding any which are within the bounds
		return this._entities.reduce((result, entity) => {
			if (
				entity.getX() >= leftX &&
				entity.getX() <= rightX &&
				entity.getY() >= topY &&
				entity.getY() <= bottomY &&
				entity.getZ() === depth
			) {
				result.push(entity);
			}
			return result;
		}, []);
	};

	/** lighting **/
	setupFov = () => {
		// Iterate through each depth level, setting up the field of vision
		forEachOfLength(this._depth, z => {
				// For each depth, we need to create a callback which figures out
				// if light can pass through a given tile.
			this._fov.push(
				new ROT.FOV.DiscreteShadowcasting(
					(x, y) => !this.getTile(x, y, z).blockingLight(),
					{topology: 4},
				),
			);
		});
	};

	getFov = (depth) => this._fov[depth];
}
