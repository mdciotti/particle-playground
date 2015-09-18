import defaults from 'defaults';

export default class SpringScroller {
	constructor(el, opts) {
		this.options = defaults(opts, {
			stiffness: 100,
			dampingRatio: 0.5,
			mass: 1
		});
		this.el = el;
		this.parent = el.parentNode;
		this.scrolling = false;
		this.target = 0;
		this.scrollStart = 0;
		this.finished = false;
		this.t0 = 0;
		this.x = 0;
		this.x_last = 0;
		this.zeta = this.options.dampingRatio;
		this.frequency = Math.sqrt(this.options.stiffness / this.options.mass);
		
		if (this.zeta < 0) {
			throw Error('Damping ratio must be >= 0');
			return;
		} else if (this.zeta === 0) {
			// No damping
		} else if (this.zeta < 1) {
			// Under damped
			this.dampedFrequency = this.frequency * Math.sqrt(1 - this.zeta * this.zeta);
		} else if (this.zeta === 1) {
			// Critically damped
		} else if (this.zeta > 1) {
			// Over damped
			throw Error('Damping ratio > 1 not yet supported');
			return;
		}

		this.EPSILON = 1;
		// this.el.style.willChange = 'transform';
		this.el.style.transform = 'translateY(0px)';
	}

	scrollTo(pos) {
		this.target = pos;
		this.finished = false;
		this.scrolling = true;
		this.x = -this.parent.scrollTop;
		this.x_last = this.x;
		this.el.style.transform = `translateY(${this.x})`;
		if (this.zeta === 0) {
			this.A = this.x;
		} else if (this.zeta < 1) {
			this.A = this.x;
			this.B = (this.zeta * this.frequency * this.x) / this.dampedFrequency;
		} else if (this.zeta === 1) {
			this.A = this.x;
			this.B = this.x * this.frequency;
		}
		this.t0 = performance.now();
		this.parent.scrollTop = 0;
		requestAnimationFrame(this.step.bind(this));
	}

	step(t) {
		if (!this.finished) { requestAnimationFrame(this.step.bind(this)); }
		else {
			// this.el.scrollTop = this.x;
			this.scrolling = false;
			this.el.style.transform = 'translateY(0px)';
			return;
		}

		let dt = (t - this.t0) / 1000;
		this.x_last = this.x;
		if (this.zeta === 0) {
			this.x = this.A * Math.cos(this.frequency * dt);
		} else if (this.zeta < 1) {
			let wdt = this.dampedFrequency * dt;
			this.x = (this.A * Math.cos(wdt) + this.B * Math.sin(wdt)) * Math.exp(-this.zeta * this.frequency * dt);
		} else if (this.zeta === 1) {
			this.x = (this.A + this.B * dt) * Math.exp(-this.frequency * dt);
		}
		let dx = this.x - this.x_last;

		if (Math.abs(this.x - this.target) < this.EPSILON && Math.abs(dx) < this.EPSILON) {
			this.finished = true;
		}

		this.el.style.transform = `translateY(${this.x}px)`;
	}
}
