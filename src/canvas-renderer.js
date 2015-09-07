import Vec2 from './vec2.js';
import { Entity, Body } from './entity.js';
import defaults from '../node_modules/defaults';

export default class CanvasRenderer {
	constructor(opts) {
		// Set default options
		this.options = defaults(opts, {
			trails: false,
			trailLength: 50,
			trailFade: false,
			trailSpace: 5,
			motionBlur: 0,
			debug: true
		});
		this.el = document.createElement('canvas');
		this.el.style.display = 'block';
		this.ctx = this.el.getContext('2d');
		this.frame = 0;
		this.following = null;
	}

	follow(entity) {
		if (entity instanceof Entity) {
			this.following = entity;
		}
	}

	unfollow() {
		this.following = null;
	}

	render(entities, input, selectedEntities, stats, params, tool) {
		let KE, PE, TE, Xend, Yend, e, m, momentum, p1, p2, unv, uv, v, inRadius, willSelect, x, y, i, j, len;

		this.ctx.fillStyle = `rgba(0, 0, 0, ${1 - this.options.motionBlur})`;
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		// this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
		
		// Only increment lineDashOffset once per frame
		this.ctx.lineDashOffset = (this.ctx.lineDashOffset + 0.5) % 10;

		// this.ctx.fillStyle = '#FFFFFF';
		// this.ctx.setLineDash([0]);

		for (i = 0, len = entities.length; i < len; ++i) {
			e = entities[i];
			x = e.position.x;
			y = e.position.y;
			this.ctx.save();
			this.ctx.fillStyle = e.color;
			this.ctx.beginPath();
			this.ctx.arc(x, y, e.radius, 0, 2 * Math.PI, false);
			this.ctx.closePath();
			this.ctx.fill();
			this.ctx.restore();

			// Mouse interaction
			if (tool._current === tool.SELECT) {
				m = new Vec2(input.mouse.x, input.mouse.y);
				inRadius = m.distSq(e.position) < e.radius * e.radius;
				willSelect = e.inRegion(input.mouse.dragStartX, input.mouse.dragStartY, input.mouse.dx, input.mouse.dy) && input.mouse.isDown;
				if (inRadius && this.ctx.canvas.style.cursor !== 'pointer') {
					this.ctx.canvas.style.cursor = 'pointer';
				} else if (!inRadius) {
					this.ctx.canvas.style.cursor = 'default';
				}
				if (inRadius || willSelect || selectedEntities.indexOf(e) >= 0) {
					this.ctx.save();
					this.ctx.strokeStyle = '#FFFFFF';
					this.ctx.lineWidth = 2;
					this.ctx.setLineDash([5]);
					this.ctx.beginPath();
					this.ctx.arc(x, y, e.radius + 4, 0, 2 * Math.PI, false);
					this.ctx.closePath();
					this.ctx.stroke();
					this.ctx.restore();
				}
			}

			// Trail Vectors
			if (this.options.trails && e instanceof Body) {
				// Add new positions
				if (this.frame % this.options.trailSpace === 0) {
					e.trailX.push(e.position.x);
					e.trailY.push(e.position.y);
				}
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
				this.ctx.lineTo(x + 10000 * e.acceleration.x, y + 10000 * e.acceleration.y);
				this.ctx.stroke();

				// Velocity Vectors
				this.ctx.strokeStyle = 'rgba(0,255,0,1)';
				this.ctx.beginPath();
				this.ctx.moveTo(x, y);
				this.ctx.lineTo(x + 10 * e.velocity.x, y + 10 * e.velocity.y);
				this.ctx.stroke();
			}
		}

		// Mouse drag
		switch (tool._current) {
			case tool.SELECT:
				if (input.mouse.isDown) {
					let x0 = input.mouse.dragStartX;
					let x1 = x0 + input.mouse.dx;
					[x0, x1] = [Math.min(x0, x1), Math.max(x0, x1)];
					let y0 = input.mouse.dragStartY;
					let y1 = y0 + input.mouse.dy;
					[y0, y1] = [Math.min(y0, y1), Math.max(y0, y1)];

					// do @ctx.beginPath
					this.ctx.save();
					this.ctx.strokeStyle = '#00ACED';
					this.ctx.fillStyle = '#00ACED';
					this.ctx.lineWidth = 2;
					this.ctx.setLineDash([5]);
					this.ctx.globalAlpha = 0.15;
					this.ctx.fillRect(x0 + 8, y0 + 8, x1 - 16 - x0, y1 - 16 - y0);
					this.ctx.globalAlpha = 1;
					this.ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
					this.ctx.restore();
				}
				break;

			case tool.CREATE:
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

				// Create entity preview around cursor
				this.ctx.strokeStyle = 'rgba(128,128,128,1)';
				this.ctx.beginPath();
				this.ctx.arc(x, y, Math.sqrt(params.createMass), 0, 2 * Math.PI, false);
				this.ctx.stroke();
		}

		++this.frame;
	}
}
