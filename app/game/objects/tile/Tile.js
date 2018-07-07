export default class Tile {
    constructor({character, foreground, background, isDiggable} = {}) {
        // Instantiate properties to default if they weren't passed
        this._char = character || ' ';
        this._foreground = foreground || 'white';
        this._background = background || 'black';
        this.isDiggable = isDiggable || false;
    }
    getChar = () => this._char;
    getBackground = () => this._background;
    getForeground = () => this._foreground;
    getIsDiggable = () => this.isDiggable;

}
