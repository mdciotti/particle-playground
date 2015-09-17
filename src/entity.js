import Vec2 from './vec2.js';

export default class Entity {
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
		this.constraints = [];
	}

	draw(ctx) {

	}

	drawTrail(ctx, frame, trailLength, trailSpace, trailFade, entityAlpha) {
		// Add new positions
		if (frame % trailSpace === 0) {
			this.trailX.unshift(this.position.x);
			this.trailY.unshift(this.position.y);
		}
		// Prune excess trails
		while (this.trailX.length > trailLength) { this.trailX.pop(); }
		while (this.trailY.length > trailLength) { this.trailY.pop(); }

		ctx.save();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';

		for (let i = 1; i < trailLength; ++i) {
			ctx.beginPath();
			if (trailFade) {
				ctx.globalAlpha = entityAlpha * (1 - i / this.trailX.length);
			}
			ctx.moveTo(this.trailX[i - 1], this.trailY[i - 1]);
			ctx.lineTo(this.trailX[i], this.trailY[i]);
			ctx.stroke();
		}
		ctx.restore();
	}

	destroy() {
		this.willDelete = true;
		while (this.constraints.length > 0) {
			this.constraints[0].destroy();
		}
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
