import DynamicTile from 'app/game/objects/DynamicTile';
import { getCompoundKey } from 'app/game/objects/GameUtils';
import { sendMessage } from 'app/game/GameInterface';
import { PLAYER_ACTOR } from 'app/game/mixins/MixinConstants';


export default class Entity extends DynamicTile {
	constructor(properties = {}) {
		super(properties);
		// Instantiate any properties from the passed object
		const { x, y, z} = properties;
		this._x = x || 0;
		this._y = y || 0;
		this._z = z || 0;
		this._alive = true;

		this._map = null;
	}

	getX = () => this._x;
	setX = x => {
		this._x = x;
	};

	getY = () => this._y;
	setY = y => {
		this._y = y;
	};

	getZ = () => this._z;
	setZ = z => {
		this._z = z;
	};

	setPosition = (x, y, z) => {
		const oldX = this._x;
		const oldY = this._y;
		const oldZ = this._z;

		// Update position
		this._x = x;
		this._y = y;
		this._z = z;

		if (this._map) {
			this._map.updateEntityPosition(this, oldX, oldY, oldZ);
		}

	};

	setMap = map => (this._map = map);
	getMap = () => this._map;

	getKey = () => getCompoundKey(this.getX(), this.getY());

	isAlive = () => this._alive;

	kill = () => {
		// Only kill once!
		if (!this._alive) {
			return;
		}
		this._alive = false;

		// Check if the player died, and if so call their act method to prompt the user.
		if (this.hasMixin(PLAYER_ACTOR)) {
			this.act();
		} else {
			this.getMap().removeEntity(this);
		}
	}
}
