export function wrapAround(value, modulus) {
	return value > 0 ? value % modulus : value + modulus;
}

export function clamp(value, a, b) {
	return a < b ? Math.min(b, Math.max(a, value)) : Math.min(a, Math.max(b, value));
}

export function mapRange(val, min, max, newMin, newMax) {
	return (val - min) / (max - min) * (newMax - newMin) + newMin;
}

export function intersect(A, B){
	let ret = [];
	for (let i = 0; i < A.length; i++) {
		for (let j = 0; j < B.length; j++) {
			if (A[i] == B[j]) { ret.push(i); break; }
		}
	}
	return ret;            
}

/**
 * Determines if a point is left or right of an infinite line
 * @param  {Vec2}  P0 the first point defining the line
 * @param  {Vec2}  P1 the second point defining the line
 * @param  {Vec2}  P2 the point to test
 * @return {Number}    a number > 0 for P2 left of the line
 *                     a number = 0 for P2 on the line
 *                     a number < 0 for P2 right of the line
 */
function isLeft(P0, P1, P2) {
	return (P1.x - P0.x) * (P2.y - P0.y) - (P2.x -  P0.x) * (P1.y - P0.y);
}

/**
 * Determines if a point is inside a polygon
 * @param  {Vec2} P the test point
 * @param  {Array} V list of vertex points (Vec2) of the polygon
 * @return {Number}   the winding number (zero when P is outside)
 */
export function pointInPoly(P, V) {
	// The winding number counter
	let wn = 0;

	// Loop through all edges of the polygon
	for (let i = 0; i < V.length; i++) {
		let j = i+1 < V.length ? i+1 : 0;
		// Edge from V[i] to  V[j]
		if (V[i].y <= P.y) {
			if (V[j].y > P.y && isLeft(V[i], V[j], P) > 0) { ++wn; }
		} else {
			if (V[j].y <= P.y && isLeft(V[i], V[j], P) < 0) { --wn; }
		}
	}
	return wn;
}
