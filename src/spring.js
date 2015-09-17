import Constraint from './constraint.js';
import defaults from 'defaults';

export default class Spring extends Constraint {
	constructor(p1, p2, opts) {
		super(p1, p2, opts);
		let d = p1.position.dist(p2.position);
		this.options = defaults(this.options, {
			stiffness: 1,
			restingDistance: d,
			damping: true,
			dampingRatio: 1 // Critically-damped
		});
		this.stiffness = this.options.stiffness;
		this.restingDistance = this.options.restingDistance;
		if (this.options.damping) {
			let zeta = this.options.dampingRatio;
			// let m = (p1.mass + p2.mass) / 2;
			let k = this.stiffness;
			this.dampingCoefficient1 = zeta * 2 * Math.sqrt(p1.mass * k);
			this.dampingCoefficient2 = zeta * 2 * Math.sqrt(p2.mass * k);
		}
	}

	update() {
		let displ = this.p1.position.subtract(this.p2.position);
		let dist = displ.magnitude();
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
	}

	draw(ctx) {
		ctx.save();
		ctx.lineWidth = 8;
		ctx.strokeStyle = "#FFFFFF";
		ctx.globalAlpha *= 0.5;
		ctx.beginPath();
		ctx.moveTo(this.p1.position.x, this.p1.position.y);
		ctx.lineTo(this.p2.position.x, this.p2.position.y);
		ctx.stroke();
		ctx.restore();
	}
}
