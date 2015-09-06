import { mapRange } from './util.js';

export default class Plot {
	constructor(ctx, bgColor = '#000000', interval = 100) {
		// Private members
		this._series = [];
		// this._width = width;
		// this._height = height;
		// this._bgColor = bgColor;
		this._pollInterval = interval;

		// Create and position canvas
		// if (ctx === null)
		// let canvas = document.createElement('canvas');
		// this.ctx = canvas.getContext('2d');
		// this.ctx.canvas.width = this._width;
		// this.ctx.canvas.height = this._height;
		// this.ctx.canvas.style.position = 'absolute';
		// this.ctx.canvas.style.bottom = 0;
		// this.ctx.canvas.style.left = 0;
		// document.body.appendChild(canvas);
		// } else {
		this.ctx = ctx;

		// Setup drawing
		// this.ctx.fillStyle = this._bgColor;
		this.ctx.clearRect(0, -this._height / 2, this._width, this._height);
		this.ctx.scale(1, -1);
		this.ctx.translate(0, -this.ctx.canvas.height / 2);
		this.render();
	}

	// Adds a new series to the plot
	addSeries(description, color, maxValue, update) {
		this._series.push({ description, color, update, maxValue });
		return this;
	}

	render() {
		window.setTimeout(this.render.bind(this), this._pollInterval);

		let w = this.ctx.canvas.width;
		let h = this.ctx.canvas.height;

		this.ctx.save();

		// Move entire plot one pixel left
		let imageData = this.ctx.getImageData(0, 0, w, h);
		this.ctx.putImageData(imageData, -1, 0);
		let x = w - 1;
		// this.ctx.fillStyle = this._bgColor;
		this.ctx.clearRect(x, -h / 2, 1, h);
		this.ctx.fillStyle = '#333333';
		this.ctx.fillRect(x, 0, 1, 1);

		// Plot one pixel for each series
		this._series.forEach(s => {
			let val = mapRange(s.update(), 0, s.maxValue, 0, h / 2);
			this.ctx.fillStyle = s.color;
			this.ctx.fillRect(x, val, 1, 1);
		});

		this.ctx.restore();
	}
}
