export function wrapAround(value, modulus) {
	return value > 0 ? value % modulus : value + modulus;
}

export function clamp(value, a, b) {
	return a < b ? Math.min(b, Math.max(a, value)) : Math.min(a, Math.max(b, value));
}

export function mapRange(val, min, max, newMin, newMax) {
	return (val - min) / (max - min) * (newMax - newMin) + newMin;
}
