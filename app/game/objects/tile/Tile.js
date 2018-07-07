export default class Tile {
    constructor(chr, foreground, background) {
        // Instantiate properties to default if they weren't passed
        this._char = chr || ' ';
        this._foreground = foreground || 'white';
        this._background = background || 'black';
    }
    getChar = () => this._char;
    getBackground = () => this._background;
    getForeground = () => this._foreground;

}
