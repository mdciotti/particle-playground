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
		this.grabbable = true;
		this.deleteConstraintsOnGrab = true;
		this.createConstraintsOnRelease = true;
		this.springRadius = 100;
		this.isGhost = false;
	}

	draw(ctx) {

	}

	drawFocusRing(ctx, isSelected) {
		ctx.save();
		ctx.globalAlpha = 1.0;
		ctx.strokeStyle = isSelected ? '#FFFFFF' : '#00ACED';
		ctx.lineWidth = 2;
		ctx.setLineDash([5]);
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.radius + 4, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
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

	drawDebug(ctx) {
		ctx.save();
		// Acceleration Vectors
		ctx.strokeStyle = 'rgba(255,0,255,1)';
		ctx.beginPath();
		ctx.moveTo(this.position.x, this.position.y);
		ctx.lineTo(this.position.x + 10000 * this.acceleration.x, this.position.y + 10000 * this.acceleration.y);
		ctx.stroke();

		// Velocity Vectors
		ctx.strokeStyle = 'rgba(0,255,0,1)';
		ctx.beginPath();
		ctx.moveTo(this.position.x, this.position.y);
		ctx.lineTo(this.position.x + 10 * this.velocity.x, this.position.y + 10 * this.velocity.y);
		ctx.stroke();

		// Names
		let w = ctx.measureText(this.name).width;
		let x = this.position.x - w / 2;
		let y = this.position.y + this.radius;
		ctx.fillStyle = '#000000';
		ctx.fillRect(x, y, w, 10);
		ctx.textBaseline = 'top';
		ctx.font = '10px sans-serif';
		ctx.fillStyle = '#FFFFFF';
		ctx.fillText(this.name, x, y);

		ctx.restore();
	}

	removeAllConstraints() {
		while (this.constraints.length > 0) {
			this.constraints[0].destroy();
		}
	}

	destroy() {
		this.willDelete = true;
		this.removeAllConstraints();
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

	integrate(dt, method) {
		let next;

		if (this.fixed) {
			this.acceleration.zero();
			this.velocity.zero();
			// continue;
			return;
		}

		switch (method) {
		case 'euler':
			this.velocity.addSelf(this.acceleration.scale(dt));
			this.lastPosition = this.position;
			this.position.addSelf(this.velocity.scale(dt));
			this.acceleration.zero();
			break;

		case 'verlet':
			this.velocity = this.position.subtract(this.lastPosition);
			// next = this.position.add(this.velocity.scale(dt)).addSelf(this.acceleration.scale(dt * dt));
			next = this.position.add(this.velocity).addSelf(this.acceleration.scale(dt * dt));
			this.lastPosition = this.position;
			this.position = next;
			this.velocity = next.subtract(this.lastPosition);
			this.acceleration.zero();
			break;

		case 'RK4':
			break;
		}
	}
}
