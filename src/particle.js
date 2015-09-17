import Vec2 from './vec2.js';
import Entity from './entity.js';

export default class Particle extends Entity {
	constructor(x, y, m, vx, vy, fixed = false) {
		super(x, y, vx, vy);
		this.mass = m;
		this.radius = Math.sqrt(this.mass);
		this.type = 'particle';
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

	draw(ctx, isolated) {
		ctx.save();
		ctx.fillStyle = this.color;
		if (isolated) { ctx.globalAlpha = 1; }
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
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
