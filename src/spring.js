import Constraint from './constraint.js';
import defaults from 'defaults';

export default class Spring extends Constraint {
	constructor(p1, p2, opts) {
		super(p1, p2, opts);
		let d = p1.position.dist(p2.position);
		this.options = defaults(this.options, {
			lineWidth: 8,
			stretch: false,
			style: 'curve',
			stiffness: 1,
			restingDistance: d,
			breakable: false,
			breakFactor: 2.0,
			damping: true,
			dampingRatio: 1 // Critically-damped
		});
		this.stiffness = this.options.stiffness;
		this.restingDistance = this.options.restingDistance;
		this.breakDistance = this.options.breakFactor * this.options.restingDistance;
		if (this.options.damping) {
			let zeta = this.options.dampingRatio;
			// let m = (p1.mass + p2.mass) / 2;
			let k = this.stiffness;
			this.dampingCoefficient1 = zeta * 2 * Math.sqrt(p1.mass * k);
			this.dampingCoefficient2 = zeta * 2 * Math.sqrt(p2.mass * k);
		}
		this._energy = 0;
	}

	get energy() {
		return this._energy;
	}

	update() {
		if (this.isGhost) { return; }
		let displ = this.p1.position.subtract(this.p2.position);
		let dist = displ.magnitude();
		if (this.options.breakable && dist > this.breakDistance) {
			this.destroy();
			return;
		}

		let n = displ.scale(1 / dist);
		let dx = dist - this.restingDistance;
		let Fs = n.scale(-this.stiffness * dx);
		// if (dx < 0) { Fs.scale(-1); }
		this.p1.applyForce(Fs);
		this.p2.applyForce(Fs.scale(-1));

		if (this.options.damping) {
			// TODO: this should use velocity due to spring force, rather than
			// the total velocity in the direction of the spring
			let v1 = n.scale(this.p1.velocity.dot(n));
			let v2 = n.scale(this.p2.velocity.dot(n));
			this.p1.applyForce(v1.scale(-this.dampingCoefficient1));
			this.p2.applyForce(v2.scale(-this.dampingCoefficient2));
		}

		this._energy = 0.5 * this.stiffness * dx * dx;
	}

	draw(ctx) {
		let delta = this.p1.position.subtract(this.p2.position);
		let dist = delta.magnitude();
		if (dist <= this.p1.radius + this.p2.radius) { return; }
		let stretchFactor = dist / this.restingDistance;
		let u = delta.scale(1 / dist);
		let v = u.perp();
		let x;
		if (this.options.stretch) {
			x = this.options.lineWidth / (2 * stretchFactor);
		} else {
			x = this.p1.radius;
		}
		let p1 = v.scale(x).addSelf(this.p1.position);
		let p2 = v.scale(-x).addSelf(this.p1.position);
		if (!this.options.stretch) { x = this.p2.radius; }
		if (this.options.style === 'tri') { x *= -1; }
		let p3 = v.scale(-x).addSelf(this.p2.position);
		let p4 = v.scale(x).addSelf(this.p2.position);

		ctx.save();
		// ctx.lineWidth = this.options.lineWidth;
		ctx.fillStyle = "#FFFFFF";
		ctx.globalAlpha *= this.isGhost ? 0.15 : 0.5;
		ctx.beginPath();

		if (this.options.style === 'curve') {
			let m = this.p1.position.midpoint(this.p2.position);
			ctx.moveTo(p2.x, p2.y);
			ctx.quadraticCurveTo(m.x, m.y, p3.x, p3.y);
			ctx.lineTo(p4.x, p4.y);
			ctx.quadraticCurveTo(m.x, m.y, p1.x, p1.y);
		} else {
			ctx.moveTo(p1.x, p1.y);
			ctx.lineTo(p2.x, p2.y);
			ctx.lineTo(p3.x, p3.y);
			ctx.lineTo(p4.x, p4.y);
		}
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
}
