class Box {
    constructor({
        id = null,
        left= 0,
        top = 0,
        width = 300,
        height = 100,
        string = 'Lorem ipsum dolor sit amet',
        textAlign = 'left',
        font_id = 300,
        color = '#000',
        fontSize = 24
    }) {
        this.id = id;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.string = string;
        this.textAlign = textAlign;
        this.font_id = font_id;
        this.color = color;
        this.fontSize = fontSize;
    }
}

export default Box;