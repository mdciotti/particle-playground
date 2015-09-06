import Vec2 from './vec2.js';
import Body from './entity.js';
import defaults from '../node_modules/defaults';

export default class CanvasRenderer {
	constructor(opts) {
		// Set default options
		this.options = defaults(opts, {
			trails: false,
			trailLength: 10,
			trailFade: false,
			motionBlur: false,
			debug: true
		});
		this.el = document.createElement('canvas');
		this.el.style.display = 'block';
		this.ctx = this.el.getContext('2d');
	}

	render(entities, input, selectedEntities, stats, params) {
		let KE, PE, TE, Xend, Yend, e, m, momentum, p1, p2, unv, uv, v, willSelect, x, y, i, j, len;

		if (this.options.motionBlur) {
			this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
		} else {
			this.ctx.fillStyle = 'black';
		}
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		this.ctx.fillStyle = 'rgba(255,255,255,0.5)';

		// this.ctx.fillStyle = '#FFFFFF';
		// this.ctx.setLineDash([0]);

		for (i = 0, len = entities.length; i < len; ++i) {
			e = entities[i];
			x = e.position.x;
			y = e.position.y;
			this.ctx.fillStyle = e.color;
			this.ctx.beginPath();
			this.ctx.arc(x, y, e.radius, 0, 2 * Math.PI, false);
			this.ctx.closePath();

			// Mouse interaction
			if (input.mouse.tool === 'select') {
				m = new Vec2(input.mouse.x, input.mouse.y);
				willSelect = input.mouse.isDown && e.inRegion(input.mouse.dragStartX, input.mouse.dragStartY, input.mouse.dx, input.mouse.dy);
				if (m.dist(e.position) < e.radius || willSelect || selectedEntities.indexOf(e) >= 0) {
					this.ctx.strokeStyle = '#FFFFFF';
					this.ctx.strokeWidth = 2;
					this.ctx.stroke();
				}
				if (selectedEntities.indexOf(e) >= 0) {
					this.ctx.fillStyle = '#00ACED';
				}
			}
			this.ctx.fill();

			// Trail Vectors
			if (this.options.trails && e instanceof Body) {
				// Add new positions
				e.trailX.push(e.position.x);
				e.trailY.push(e.position.y);
				// Prune excess trails
				while (e.trailX.length > this.options.trailLength) { e.trailX.shift(); }
				while (e.trailY.length > this.options.trailLength) { e.trailY.shift(); }

				this.ctx.strokeWidth = 1;
				this.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
				this.ctx.save();

				for (j = 1; j < this.options.trailLength; ++j) {
					this.ctx.beginPath();
					if (this.options.trailFade) {
						this.ctx.globalAlpha = j / e.trailX.length;
					}
					this.ctx.moveTo(e.trailX[j - 1], e.trailY[j - 1]);
					this.ctx.lineTo(e.trailX[j], e.trailY[j]);
					this.ctx.stroke();
				}
				this.ctx.restore();
			}

			if (this.options.debug) {
				// Acceleration Vectors
				this.ctx.strokeStyle = 'rgba(255,0,255,1)';
				this.ctx.beginPath();
				this.ctx.moveTo(x, y);
				this.ctx.lineTo(x + 1000 * e.position.ax, y + 1000 * e.position.ay);
				this.ctx.stroke();

				// Velocity Vectors
				this.ctx.strokeStyle = 'rgba(0,255,0,1)';
				this.ctx.beginPath();
				this.ctx.moveTo(x, y);
				this.ctx.lineTo(x + 10 * e.position.vx, y + 10 * e.position.vy);
				this.ctx.stroke();
			}
		}

		// Mouse drag
		switch (input.mouse.tool) {
			case 'SELECT':
				if (input.mouse.isDown) {
					this.ctx.lineDashOffset = (this.ctx.lineDashOffset + 0.5) % 10;
					// do @ctx.beginPath
					this.ctx.save();
					this.ctx.strokeStyle = '#00ACED';
					this.ctx.fillStyle = '#00ACED';
					this.ctx.lineWidth = 2;
					this.ctx.setLineDash([5]);
					this.ctx.strokeRect(input.mouse.dragStartX, input.mouse.dragStartY, input.mouse.dx, input.mouse.dy);
					this.ctx.globalAlpha = 0.5;
					this.ctx.fillRect(input.mouse.dragStartX, input.mouse.dragStartY, input.mouse.dx, input.mouse.dy);
					this.ctx.restore();
				}
				break;

			case 'CREATE':
				x = input.mouse.x;
				y = input.mouse.y;

				if (input.mouse.isDown) {
					x = input.mouse.dragStartX;
					y = input.mouse.dragStartY;

					v = new Vec2(input.mouse.dx, input.mouse.dy);
					uv = v.normalize();
					unv = new Vec2(-uv.y, uv.x);

					p1 = v.subtract(uv.subtract(unv).scale(10));
					p2 = p1.subtract(unv.scale(20));

					Xend = input.mouse.dragStartX + input.mouse.dx;
					Yend = input.mouse.dragStartY + input.mouse.dy;

					this.ctx.strokeStyle = 'rgba(255,0,0,1)';

					this.ctx.beginPath();
					this.ctx.moveTo(input.mouse.dragStartX, input.mouse.dragStartY);
					this.ctx.lineTo(Xend, Yend);
					this.ctx.lineTo(input.mouse.dragStartX + p1.x, input.mouse.dragStartY + p1.y);
					this.ctx.moveTo(input.mouse.dragStartX + p2.x, input.mouse.dragStartY + p2.y);
					this.ctx.lineTo(Xend, Yend);
					this.ctx.stroke();
				}

				this.ctx.strokeStyle = 'rgba(128,128,128,1)';
				this.ctx.beginPath();
				this.ctx.arc(x, y, Math.sqrt(params.createMass), 0, 2 * Math.PI, false);
				this.ctx.stroke();
		}
	}
}
