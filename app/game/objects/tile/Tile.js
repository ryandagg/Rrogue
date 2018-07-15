export default class Tile {
    constructor({
        character,
        foreground,
        background,
        isDiggable,
        walkable,
    } = {}) {
        // Instantiate properties to default if they weren't passed
        this._char = character || ' ';
        this._foreground = foreground || 'white';
        this._background = background || 'black';
        this._diggable = isDiggable || false;
        this._walkable = walkable || false;
    }
	getChar = () => this._char;
	getBackground = () => this._background;
	getForeground = () => this._foreground;
	diggable = () => this._diggable;
	walkable = () => this._walkable;
}
