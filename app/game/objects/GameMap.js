import { getNullTile, getFloorTile } from './tile/TileUtils';
import ROT from 'rot-js';
import { forEachOfLength } from 'app/utils/ArrayUtils';
import Entity from 'app/game/objects/entities/Entity';
import { fungusTemplate } from 'app/game/templates/MonsterTemplates';
import { ACTOR } from 'app/game/mixins/MixinConstants';

export default class GameMap {
	constructor(tiles) {
		this._tiles = tiles;
		// cache the width and height based
		// on the length of the dimensions of
		// the tiles array
		this._width = tiles.length;
		this._height = tiles[0].length;

		// create a list which will hold the entities
		this._entities = [];
		// create the engine and scheduler
		this._scheduler = new ROT.Scheduler.Simple();
		this._engine = new ROT.Engine(this._scheduler);
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
		if (this.getTile(x, y).diggable()) {
			this._tiles[x][y] = getFloorTile();
		}
	};

	isEmptyFloor = (x, y) => {
		const tile = this.getTile(x, y);
		// Check if the tile is floor and also has no entity
		return tile && tile.walkable() && !this.getEntityAt(x, y);
	};

	getRandomFloorPosition = () => {
		// Randomly generate a tile which is a floor
		let x, y;
		do {
			x = Math.floor(Math.random() * this._width);
			y = Math.floor(Math.random() * this._width);
		} while (!this.isEmptyFloor(x, y));

		return { x, y };
	};

	getEngine = () => this._engine;

	/** entities **/
	getEntities = () => this._entities;

	getEntityAt = (x, y) =>
		this._entities.find(
			entity => entity.getX() === x && entity.getY() === y,
		) || false;

	addEntity = entity => {
		// Make sure the entity's position is within bounds
		if (
			entity.getX() < 0 ||
			entity.getX() >= this._width ||
			entity.getY() < 0 ||
			entity.getY() >= this._height
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

	addEntityAtRandomPosition = entity => {
		const { x, y } = this.getRandomFloorPosition();
		entity.setX(x);
		entity.setY(y);
		this.addEntity(entity);
	};

	populateMonsters = () => {
		forEachOfLength(25, () =>
			this.addEntityAtRandomPosition(new Entity(fungusTemplate)),
		);
	};

	getEntitiesWithinRadius = function(centerX, centerY, radius) {
		const results = [];
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
				entity.getY() <= bottomY
			) {
				results.push(entity);
			}
			return results;
		});
	};
}
