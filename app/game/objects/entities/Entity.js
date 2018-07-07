import Tile from 'app/game/objects/tile/Tile';

export default class Entity extends Tile {
    constructor(properties = {}) {
        super(properties);
        // Instantiate any properties from the passed object
        const {x, y, name, mixins = []} = properties;
        this._name = name || '';
        this._x = x || 0;
        this._y = y || 0;

        this._attachedMixins = {};
        // Setup the object's mixins
        mixins.forEach((mixin) => {
            // Copy over all properties from each mixin as long
            // as it's not the name or the init property. We
            // also make sure not to override a property that
            // already exists on the entity.
            Object.keys(mixin).forEach((key) => {
                if (key !== 'init' && key !== 'name' && !this.hasOwnProperty(key)) {
                    this[key] = mixin[key];
                }
            });

            // Add the name of this mixin to our attached mixins
            this._attachedMixins[mixin.name] = true;
            // Finally call the init function if there is one
            if (mixin.init) {
                mixin.init.call(this, properties);
            }
        });
    }

    hasMixin = (lookup) => {
        // Allow passing the mixin itself or the name as a string
        if (typeof lookup === 'object') {
            return this._attachedMixins[lookup.name];
        } else {
            return this._attachedMixins[lookup];
        }
    };

    getName = () => this._name;
    setName = (name) => {
        this._name = name;
    };

    getX = () => this._x;
    setX = (x) => {
        this._x = x;
    };

    getY = () => this._y;
    setY = (y) => {
        this._y = y;
    };
}
