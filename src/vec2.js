// Vector Processor
export class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    cross(v) {
        return new Vec3(
            this.y * v.z - this.z * v.y,
            this.x * v.z - this.z * v.x,
            this.x * v.y - this.y * v.x
        );
    }
}

export default class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    transform(fn, args) {
        return new Vec2(
            fn.apply(null, [this.x].concat(args)),
            fn.apply(null, [this.y].concat(args))
        );
    }

    transformSelf(fn, args) {
        this.x = fn.apply(null, [this.x].concat(args));
        this.y = fn.apply(null, [this.y].concat(arge));
    }

    setPolar(r, theta) {
        this.x = r * Math.cos(theta);
        this.y = r * Math.sin(theta);
    }

    add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
    subtract(v) { return new Vec2(this.x - v.x, this.y - v.y); }
    scale(v) { return new Vec2(this.x * v, this.y * v); }
    magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    magnitudeSq() { return this.x * this.x + this.y * this.y; }
    midpoint(v) { return new Vec2(0.5 * (this.x + v.x), 0.5 * (this.y + v.y)); }
    dot(v) { return this.x * v.x + this.y * v.y; }
    crossMag(v) { return this.x * v.y - this.y * v.x; }
    copy(v) { return new Vec2(v.x, v.y); }
    angle() { return Math.atan2(this.y, this.x); }
    angleFrom(v) { return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude())); }

    proj(v) { return this.dot(v.normalize()); }

    normalize() {
        let iMag = 1 / this.magnitude();
        return new Vec2(this.x * iMag, this.y * iMag);
    }

    dist(v) {
        let dx = v.x - this.x;
        let dy = v.y - this.y;
        return Math.sqrt(dx*dx + dy*dy);
    }

    distSq(v) {
        let dx = v.x - this.x;
        let dy = v.y - this.y;
        return dx*dx + dy*dy;
    }

    addSelf(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtractSelf(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    scaleSelf(k) {
        this.x *= k;
        this.y *= k;
        return this;
    }

    zero() {
        this.x = 0;
        this.y = 0;
        return this;
    }

    normalizeSelf() {
        let iMag = 1 / this.magnitude();
        this.x *= iMag;
        this.y *= iMag;
        return this;
    }

    inspect(n = 2) { return `(${this.x.toFixed(n)}, ${this.y.toFixed(n)})`; }

    toString() {
        return this.inspect(2);
    }

    static add(a, b) { return new Vec2(a.x + b.x, a.y + b.y); }
    static subtract(a, b) { return new Vec2(a.x - b.x, a.y - b.y); }
    static scale(a, k) { return new Vec2(k * a.x, k * a.y); }
    static normalize(a) { return new Vec2(k * a.x, k * a.y); }
}
