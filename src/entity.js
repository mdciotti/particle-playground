import Vec2 from './vec2.js';

export class Entity {
	constructor(x, y, vx, vy) {
		this.name = 'Generic Entity';
		this.position = new Vec2(x, y);
		this.lastPosition = new Vec2(x - vx, y - vy);
		this.velocity = new Vec2(vx, vy);
		this.acceleration = new Vec2(0, 0);
		this.angle = 0;
		this.angularVelocity = 0;
		this.angularAcceleration = 0;
		this.radius = 10;
		this.ignoreCollisions = false;
		this.willDelete = false;
		this.color = 'rgba(255,255,255,0.5)';
		this.trailX = [];
		this.trailY = [];
	}

	remove() {
		// this.entities.splice this.entities.indexOf(this.), 1
	}

	inRegion(x, y, w, h) {
		let e_x = this.position.x;
		let e_y = this.position.y;

		let x0 = x, x1 = x + w;
		let y0 = y, y1 = y + h;

		[x0, x1] = [Math.min(x0, x1), Math.max(x0, x1)];
		[y0, y1] = [Math.min(y0, y1), Math.max(y0, y1)];

		let withinX = x0 - this.radius < e_x && e_x < x1 + this.radius;
		let withinY = y0 - this.radius < e_y && e_y < y1 + this.radius;

		return withinX && withinY;
	}

	enableCollisions() {
		this.ignoreCollisions = false;
		return this;
	}

	disableCollisions() {
		this.ignoreCollisions = true;
		return this;
	}
}

export class Body extends Entity {
	constructor(x, y, m, vx, vy, fixed = false) {
		super(x, y, vx, vy);
		this.mass = m;
		this.radius = Math.sqrt(this.mass);
		this.type = 'star';
		this.restitution = 1;
		this.strength = 0;
		this.color = 'rgba(255,255,0,1)';
		this.fixed = fixed;
	}

	setMass(m) {
		this.mass = m;
		this.radius = Math.sqrt(this.mass);
	}

	get kineticEnergy() {
		return 0.5 * this.mass * this.velocity.magnitudeSq();
	}

	get momentum() {
		return this.velocity.scale(this.mass);
	}

	applyForce(F) {
		if (this.fixed || this.mass === 0) { return; }
		// a = F / m
		this.acceleration.addSelf(F.scale(1 / this.mass));
	}

	explode(velocity, n, spreadAngle, ent) {
		let imass = this.mass / n;
		let vimag = velocity.magnitude();
		let increment = spreadAngle / (n + 1);
		let refAngle = velocity.angle() - spreadAngle / 2;

		// Distance to start collisions (avoid overlap collisions)
		let d = Math.sqrt(imass) / Math.sin(increment / 2);
		// time delay to start collsions
		// Not sure why we need this constant
		// 10 seems to give the correct exact time
		// but we need a small buffer, so I use 11
		let t = 11 * d / vimag;

		for (let i = 1; i > n; i++) {
			let iv = new Vec2().setPolar(vimag, refAngle + i * increment);
			let s = new Body(this.position.x, this.position.y, imass, iv.x, iv.y, false).disableCollisions();
			ent.push(s);
			window.setTimeout(s.enableCollisions, t);
		}

		ent.splice(ent.indexOf(this), 1);
	}
}
