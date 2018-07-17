import { getNullTile, getFloorTile } from './tile/TileUtils';
import ROT from 'rot-js';
import { forEachOfLength, getArrayOfLength } from 'app/utils/ArrayUtils';
import Entity from 'app/game/objects/entities/Entity';
import { fungusTemplate, batTemplate, newtTemplate } from 'app/game/templates/MonsterTemplates';
import { ACTOR } from 'app/game/mixins/MixinConstants';
import {getRandomPositionForCondition, getCompoundKey} from 'app/game/objects/GameUtils';

const templates = [fungusTemplate, batTemplate,newtTemplate];

export default class GameMap {
	constructor(tiles, player) {
		this._tiles = tiles;
		// cache the width and height based
		// on the length of the dimensions of
		// the tiles array
		this._width = tiles[0].length;
		this._height = tiles[0][0].length;
		this._depth = tiles.length;

		const arrayOfDepth = getArrayOfLength(this._depth);
		// Setup the explored array
		this._explored = new Array(this._depth);
		this._fov = [];
		// create a list which will hold the entities
		this._entities = arrayOfDepth.map(() => ({}));
		// create a list which will hold the items
		this._items = arrayOfDepth.map(() => ({}));
		// create the engine and scheduler
		// todo: create 1 engine and scheduler per level?
		this._schedulers = arrayOfDepth.map(() => new ROT.Scheduler.Simple());
		this._engines = this._schedulers.map((scheduler) => new ROT.Engine(scheduler));

		// add the player
		this.addEntityAtRandomPosition(player, 0);
		forEachOfLength(this._depth, (z) => this.populateMonsters(z));
		// setup the field of visions
		this._setupFov();
		this._setupExploredArray();
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

	getEngine = (z) => this._engines[z];

	/** entities **/
	getEntitiesOnDepth = (depth) => this._entities[depth];


	getEntityAt = (x, y, z) => {
		return this._entities[z][getCompoundKey(x, y)] || false;
	};

	setEntityAt = (entity) => {
		this._entities[entity.getZ()][entity.getKey()] = entity;
	};

	deleteEntityAt = (x, y, z) => {
		delete this._entities[z][getCompoundKey(x, y)];
	};

	addEntity = (entity, zOverride) => {
		// Update the entity's map
		entity.setMap(this);
		// Add the entity to the list of entities
		this.updateEntityPosition(entity);
		// Check if this entity is an actor, and if so add
		// them to the scheduler
		if (entity.hasMixin(ACTOR)) {
			const depth = zOverride != null ? zOverride : entity.getZ();
			this._schedulers[depth].add(entity, true);
		}
	};

	removeEntity = (entity, zOverride) => {
		this.deleteEntityAt(entity.getX(), entity.getY(), entity.getZ());
		// If the entity is an actor, remove them from the scheduler
		if (entity.hasMixin(ACTOR)) {
			const depth = zOverride != null ? zOverride : entity.getZ();
			this._schedulers[depth].remove(entity);
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
		forEachOfLength(25, () => {
			// Randomly select a template
			const template = templates[Math.floor(Math.random() * templates.length)];
			// Add random enemies to each floor.
			this.addEntityAtRandomPosition(new Entity(template), z);
		});
	};

	getEntitiesWithinRadius = ({centerX, centerY, depth, radius}) => {
		// Determine our bounds
		const leftX = centerX - radius;
		const rightX = centerX + radius;
		const topY = centerY - radius;
		const bottomY = centerY + radius;
		const levelEntities = this._entities[depth];
		// Iterate through our entities, adding any which are within the bounds
		return Object.keys(levelEntities).reduce((result, key) => {
			const entity = levelEntities[key];
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

	updateEntityPosition = (entity, oldX, oldY, oldZ) => {
		// Delete the old key if it is the same entity and we have old positions.
		// expect the entities internal information to incorrect
		if (oldX && this.getEntityAt(oldX, oldY, oldZ) === entity) {
			this.deleteEntityAt(oldX, oldY, oldZ);
		}
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
		// Sanity check to make sure there is no entity at the new position.
		if (this._entities[entity.getZ()][entity.getKey()]) {
			throw new Error('Tried to add an entity at an occupied position.');
		}
		// Add the entity to the table of entities
		this.setEntityAt(entity);
	};

	changeFloorOfEntity = (player, oldZ, newZ) => {
		// todo: put them on the correct x,z
		this.removeEntity(player, oldZ);
		this.addEntity(player, newZ);
	};

	/** lighting **/
	_setupFov = () => {
		// Iterate through each depth level, setting up the field of vision
		forEachOfLength(this._depth, z => {
				// For each depth, we need to create a callback which figures out
				// if light can pass through a given tile.
			this._fov.push(
				new ROT.FOV.DiscreteShadowcasting(
					(x, y) => !this.getTile(x, y, z).blockingLight(),
					{topology: 8},
				),
			);
		});
	};

	getFov = (depth) => this._fov[depth];

	_setupExploredArray = () => {
		forEachOfLength(this._depth, (z) => {
			this._explored[z] = new Array(this._width);
			forEachOfLength(this._width, (x) => {
				this._explored[z][x] = new Array(this._height);
				forEachOfLength(this._height, (y) => this._explored[z][x][y] = false);
			});
		});
	};

	setExplored = (x, y, z, isExplored) => {
		// Only update if the tile is within bounds
		if (this.getTile(x, y, z).getChar()) {
			this._explored[z][x][y] = isExplored;
		}
	};

	isExplored = (x, y, z) => this._explored[z][x][y] || false;

	/** items **/
	getItemsAt = (x, y, z) => this._items[z][getCompoundKey(x, y)];

	setItemsAt = (x, y, z, items) => {
		// If our items array is empty, then delete the key from the table.
		const key = getCompoundKey(x, y);
		const floorsItems = this._items[z];
		if (!items || (items.length === 0 && floorsItems[key])) {
			delete floorsItems[key];
		} else {
			// Simply update the items at that key
			floorsItems[key] = items;
		}
	};

	addItem = (x, y, z, item) => {

		const key = getCompoundKey(x, y);
		const items = this._items[z][key];
		// If we already have items at that position, simply append the item to the
		// list of items.
		if (items) {
			items.push(item);
		} else {
			items[key] = [item];
		}
	};

	addItemAtRandomPosition = (item, z) => {
		const {x, y} = this.getRandomFloorPosition(z);
		this.addItem(x, y, z, item);
	};
}
