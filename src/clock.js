export default class Clock {
	constructor() {
		this._last = 0;
		this.time = Number.MIN_VALUE;
		this.timeScale = 1000;
		this.max_dt = 1 / 60;
		this.callbacks = [];
		this.dt = this.max_dt;
	}

	register(cb) {
		this.callbacks.push(cb);
		return this;
	}

	get delta() {
		// 0.001 * (Date.now() - this._last);
		return this.time - this._last;
	}

	tick() {
		this.dt = this.timeScale * Math.min(Date.now() - this._last, this.max_dt);
		this._last = this.time;
		this.time += this.dt;

		for (let i = 0, len = this.callbacks.length; i < len; i++) {
			this.callbacks[i]();
		}
		return this;
	}
}
