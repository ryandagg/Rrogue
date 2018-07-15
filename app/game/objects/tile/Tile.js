export default class Tile {
	constructor(args = {}) {
		const {
			character,
			foreground,
			background,
			isDiggable,
			walkable,
			upStairs,
			downStairs,
		} = args;

		// Instantiate properties to default if they weren't passed
		this._char = character || ' ';
		this._foreground = foreground || 'white';
		this._background = background || 'black';
		this._diggable = isDiggable || false;
		this._walkable = walkable || false;
		this._upStairs = upStairs || false;
		this._downStairs = downStairs || false;
	}
	getChar = () => this._char;
	getBackground = () => this._background;
	getForeground = () => this._foreground;
	diggable = () => this._diggable;
	walkable = () => this._walkable;
	downStairs = () => this._downStairs;
	upStairs = () => this._upStairs;
}
