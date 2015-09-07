import Vec2 from './vec2.js';
import collider from './collider.js';
import defaults from '../node_modules/defaults';

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
	}

	update(dt) {
		let i, len, iA, A, iB, B, d, dist2, f, FA, FB, e, next, to_create, v2;
		this.stats.totalMass = 0;
		this.stats.totalKineticEnergy = 0;
		this.stats.totalPotentialEnergy = 0;
		this.stats.totalMomentum.zero();

		// Prune objects marked for deletion
		this.entities = this.entities.filter(e => { return !e.willDelete; });

		len = this.entities.length;

		// Force Accumulator
		for (iA = 0; iA < len; iA++) {
			A = this.entities[iA];

			if (!A.hasOwnProperty('mass') || A.fixed) { continue; }

			// Apply friction
			if (this.options.friction > 0) {
				v2 = A.velocity.magnitudeSq();
				if (v2 > 0) {
					A.applyForce(A.velocity.normalize()
						.scaleSelf(-v2 * this.options.friction * A.radius / 100));
				}
			}

			if (this.options.gravity) {
				for (iB = iA + 1; iB < len; iB++) {
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

		// Integrator
		for (i = 0; i < len; i++) {
			e = this.entities[i];
			if (e.fixed) {
				e.acceleration.zero();
				e.velocity.zero();
				continue;
			}

			switch (this.options.integrator) {
				case 'euler':
					e.velocity.addSelf(e.acceleration.scale(dt));
					e.lastPosition = e.position;
					e.position.addSelf(e.velocity.scale(dt));
					e.acceleration.zero();
					break;

				case 'verlet':
					e.velocity = e.position.subtract(e.lastPosition);
					// next = e.position.add(e.velocity.scale(dt)).addSelf(e.acceleration.scale(dt * dt));
					next = e.position.add(e.velocity).addSelf(e.acceleration.scale(dt * dt));
					e.lastPosition = e.position;
					e.position = next;
					e.velocity = next.subtract(e.lastPosition);
					e.acceleration.zero();
					break;

				case 'RK4':
					break;

				default:
					this.stop();
			}

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

		for (i = 0, len = to_create.length; i < len; i++) {
			this.entities.push(to_create[i]);
		}
	}
}