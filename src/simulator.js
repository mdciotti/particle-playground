import Vec2 from './vec2.js';
import collider from './collider.js';
import Entity from './entity.js';
import Constraint from './constraint.js';
import defaults from 'defaults';

export default class Simulator {
	constructor(opts) {
		// Set default options
		this.options = defaults(opts, {
			collisions: 'elastic',
			integrator: 'euler',
			bounded: true,
			friction: 0,
			gravity: false,
			bounds: { left: 0, top: 0, width: 100, height: 100 }
		});
		this.entities = [];
		this.constraints = [];
		this.collider = collider;

		this.stats = {
			totalKineticEnergy: 0,
			totalPotentialEnergy: 0,
			totalMomentum: new Vec2(0, 0),
			totalHeat: 0
		};

		this.parameters = {
			gravity: 6.67e-2,
			createMass: 100
		};
	}

	reset() {
		this.entities.length = 0;
		this.constraints.length = 0;
	}

	add(...objects) {
		objects.forEach(obj => {
			if (obj instanceof Entity) {
				this.entities.push(obj);
			} else if (obj instanceof Constraint) {
				this.constraints.push(obj);
			}
		});
	}

	update(dt) {
		let i, iA, A, iB, B, d, dist2, f, FA, FB, e, next, to_create, v2;
		this.stats.totalMass = 0;
		this.stats.totalKineticEnergy = 0;
		this.stats.totalPotentialEnergy = 0;
		this.stats.totalMomentum.zero();

		// Prune objects marked for deletion
		this.entities = this.entities.filter(e => { return !e.willDelete; });
		this.constraints = this.constraints.filter(c => { return !c.willDelete; });

		let entity_count = this.entities.length;
		let constraint_count = this.constraints.length;

		// Force Accumulator
		for (iA = 0; iA < entity_count; iA++) {
			A = this.entities[iA];

			if (!A.hasOwnProperty('mass') || A.fixed) { continue; }

			A.applyFriction(this.options.friction);

			if (this.options.gravity) {
				for (iB = iA + 1; iB < entity_count; iB++) {
					B = this.entities[iB];

					if (!B.hasOwnProperty('mass') || B.fixed) { continue; }

					d = B.position.subtract(A.position).normalizeSelf();
					dist2 = A.position.distSq(B.position);
					f = this.parameters.gravity * A.mass * B.mass / dist2;
					FA = d.scale(f);
					FB = d.scale(-f);

					A.applyForce(FA);
					B.applyForce(FB);

					// Not sure why we need to multiply this by two...
					// But the conservation of energy mostly works out if we do
					this.stats.totalPotentialEnergy -= 2 * f * Math.sqrt(dist2);
				}
			}
		}

		// Accumulate spring forces
		for (i = 0; i < constraint_count; i++) {
			let c = this.constraints[i];
			c.update();
			this.stats.totalPotentialEnergy -= c.energy;
		}

		// Integrator
		for (i = 0; i < entity_count; i++) {
			e = this.entities[i];
			e.integrate(dt, this.options.integrator);

			if (e.hasOwnProperty('mass')) {
				this.stats.totalMass += e.mass;
				this.stats.totalKineticEnergy += e.kineticEnergy;
				this.stats.totalMomentum.addSelf(e.momentum);
			}
		}

		to_create = this.collider(
			this.entities,
			this.options.collisions,
			this.options.bounded,
			this.options.bounds,
			dt
		);

		let len = to_create.length;
		for (i = 0; i < len; i++) {
			this.entities.push(to_create[i]);
		}
	}
}