export default class Tile {
    constructor({character, foreground, background, isDiggable, isWalkable} = {}) {
        // Instantiate properties to default if they weren't passed
        this._char = character || ' ';
        this._foreground = foreground || 'white';
        this._background = background || 'black';
        this._isDiggable = isDiggable || false;
        this._isWalkable = isWalkable || false;
    }
    getChar = () => this._char;
    getBackground = () => this._background;
    getForeground = () => this._foreground;
    isDiggable = () => this._isDiggable;
    isWalkable = () => this._isWalkable;

}
