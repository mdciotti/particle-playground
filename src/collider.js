import Vec2 from './vec2.js';
import Particle from './particle.js';
import { intersect } from './util.js';

export default function collider(entities, response, bounded, bounds, dt) {
	let displacement, A_momentum, Av, Avn, B_momentum, Bv, Bvn, C_momentum, C_velocity,
		F, M, M_inverse, R, absorbtionRate, dist, dm, k, mA, mB, overlap, pA, pA1, pB, pB1, s, un, ut;

	// Keep track of which entities to create after this
	let to_create = [];

	entities.forEach((A, iA) => {
		if (A.ignoreCollisions || A.isGhost) { return; }

		// Bound points within container
		// Apply spring force when out of bounds
		if (bounded) {
			k = 2000;
			displacement = (A.position.x - A.radius) - bounds.left;
			if (displacement <= 0) {
				// A.applyForce(new Vec2(-k * displacement, 0));
				A.velocity.x = A.restitution * Math.abs(A.velocity.x);
			}
			displacement = (A.position.x + A.radius) - bounds.width;
			if (displacement >= 0) {
				// A.applyForce(new Vec2(-k * displacement, 0));
				A.velocity.x = -A.restitution * Math.abs(A.velocity.x);
			}
			displacement = (A.position.y - A.radius) - bounds.top;
			if (displacement <= 0) {
				// A.applyForce(new Vec2(0, -k * displacement));
				A.velocity.y = A.restitution * Math.abs(A.velocity.y);
			}
			displacement = (A.position.y + A.radius) - bounds.height;
			if (displacement >= 0) {
				// A.applyForce(new Vec2(0, -k * displacement));
				A.velocity.y = -A.restitution * Math.abs(A.velocity.y);
			}
		}

		entities.slice(iA + 1).forEach((B, iB) => {
			if (B.ignoreCollisions || B.isGhost) { return; }

			// If the `disableSelfCollisions` flag is set on a constraint common
			// to both entities, do not collide these entities,
			let commonConstraints = intersect(A.constraints, B.constraints);
			if (commonConstraints.length > 0) {
				for (let i = 0; i < commonConstraints.length; ++i) {
					if (commonConstraints[i].disableSelfCollisions) { break; }
				}
				return;
			}

			dist = A.position.dist(B.position);
			// dist2 = A.position.distSq(B.position);
			overlap = A.radius + B.radius - dist;
			absorbtionRate = overlap / 5;

			if (overlap >= 0) {
				// console.log('collision', this.collisions);

				// Total mass
				M = A.mass + B.mass;
				M_inverse = 1 / M;

				switch (response) {
					case 'merge':
						// Calculate new velocity from individual momentums
						A_momentum = A.velocity.scale(A.mass);
						B_momentum = B.velocity.scale(B.mass);
						C_momentum = A_momentum.add(B_momentum);
						C_velocity = C_momentum.scale(M_inverse);

						// Solve for center of mass
						R = A.position.scale(A.mass).add(B.position.scale(B.mass)).scale(M_inverse);

						// Create new particle at center of mass
						to_create.push(new Particle(R.x, R.y, M, C_velocity.x, C_velocity.y, false));
						console.log(iA, iB);

						// Remove old points
						A.destroy();
						B.destroy();

						// if( A.mass > B.mass) {
						// 	indices_to_delete.push(iB);
						// 	A.position.set(R.x, R.y);
						// 	A.setMass(M);
						// 	A.radius = Math.sqrt(A.mass);
						// 	A.velocity.set(C_velocity.x, C_velocity.y);
						// } else {
						// 	indices_to_delete.push(iA);
						// 	B.position.set(R.x, R.y);
						// 	B.setMass(M);
						// 	B.radius = Math.sqrt(B.mass);
						// 	B.velocity.set(C_velocity.x, C_velocity.y);
						// }

						break;

					case 'pass':
						k = 0.5;
						A.velocity = Vec2.add(A.velocity.scale(1.0 - k), B.velocity.scale(k * B.mass / A.mass));
						B.velocity = Vec2.add(B.velocity.scale(1.0 - k), A.velocity.scale(k * A.mass / B.mass));
						break;

					case 'absorb':
						dm = absorbtionRate;
						pA = A.velocity.scale(A.mass);
						pB = B.velocity.scale(B.mass);
						mA = A.mass + dm;
						mB = B.mass + dm;
						pA1 = A.velocity.scale(dm);
						pB1 = B.velocity.scale(dm);

						if (A.mass > B.mass) {
							A.velocity.addSelf((pA.add(pB1)).normalizeSelf().scaleSelf(1 / mA));
							B.velocity.addSelf((pA.subtract(pB1)).normalizeSelf().scaleSelf(1 / mB));
							A.setMass(A.mass + dm);
							B.setMass(B.mass - dm);
						} else {
							A.velocity.addSelf((pB.subtract(pA1)).normalizeSelf().scaleSelf(1 / mA));
							B.velocity.addSelf((pB.add(pA1)).normalizeSelf().scaleSelf(1 / mB));
							A.setMass(A.mass - dm);
							B.setMass(B.mass + dm);
						}

						// dpA = A.velocity.scale(dm);
						// dpB = B.velocity.scale(-dm);

						if (A.mass <= 0) A.destroy();
						if (B.mass <= 0) B.destroy();
						break;

					case 'elastic':
						// Bodies bounce off of each other
						// TODO: change position rather than velocity?
						// Or maybe we should apply an impulse?

						un = A.position.subtract(B.position).normalizeSelf();
						ut = new Vec2(-un.y, un.x);
						Avn = A.velocity.dot(un);
						Bvn = B.velocity.dot(un);

						[Avn, Bvn] = [
							M_inverse * (Avn * (A.mass - B.mass) + 2 * B.mass * Bvn),
							M_inverse * (Bvn * (B.mass - A.mass) + 2 * A.mass * Avn)
						];

						// Modify Velocity (does not work with Verlet)
						// TODO: prevent entities from getting stuck to each other
						// by setting the velocity to always repel
						A.velocity = un.scale(Avn).addSelf(ut.scale(A.velocity.dot(ut)));
						B.velocity = un.scale(Bvn).addSelf(ut.scale(B.velocity.dot(ut)));


						// Impulse method
						// A.velocity = this.clock.dt *
						// vr.scale(-(1 + e)).dot(n) / (Am_inv + Bm_inv + ()

						break;

					case 'shatter':
						// Like elastic, but stars shatter if change
						// in momentum is too high (high impulse)

						un = A.position.subtract(B.position).normalizeSelf();
						ut = new Vec2(-un.y, un.x);
						Avn = A.velocity.dot(un);
						Bvn = B.velocity.dot(un);

						[Avn, Bvn] = [
							M_inverse * (Avn * (A.mass - B.mass) + 2 * B.mass * Bvn),
							M_inverse * (Bvn * (B.mass - A.mass) + 2 * A.mass * Avn)
						];

						Av = un.scale(Avn).addSelf(ut.scale(A.velocity.dot(ut)));
						Bv = un.scale(Bvn).addSelf(ut.scale(B.velocity.dot(ut)));

						// Approximate force of collision
						// (same for A and B due to Newton's 3rd law)
						F = A.velocity.subtract(Av).magnitude() * A.mass;

						if (F > A.strength) { A.explode(Av, 3, Math.PI, entities); }
						else { A.velocity = Av; }

						if (F > B.strength) { B.explode(Bv, 3, Math.PI / 2, entities); }
						else { A.velocity = Av; }

						break;

					case 'explode':
						// Calculate new velocity from individual momentums
						A_momentum = A.velocity.scale(A.mass);
						B_momentum = B.velocity.scale(B.mass);
						C_momentum = A_momentum.add(B_momentum);
						C_velocity = C_momentum.scale(M_inverse);

						// Solve for center of mass
						R = A.position.scale(A.mass).add(B.position.scale(B.mass)).scale(M_inverse);

						// Create new star at center of mass
						s = new Particle(R.x, R.y, M, C_velocity.x, C_velocity.y, false);
						entities.push(s);
						s.explode(C_velocity, 5, 2 * Math.PI, entities);

						// Remove old points
						A.destroy();
						B.destroy();
				}
			}
		});
	});
	return to_create;
}
