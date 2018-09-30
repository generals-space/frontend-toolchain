class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
  
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

let p = new Point(1, 3);
console.log(p.toString());

var greet = (name) => {
    console.log(name);
};

greet('general');

let result = Object.is({}, {});
console.log(result);

let s = new Set();