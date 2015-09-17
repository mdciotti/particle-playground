import Vec2 from './vec2.js';
import Entity from './entity.js';
import Particle from './particle.js';
import defaults from 'defaults';

export default class CanvasRenderer {
	constructor(opts) {
		// Set default options
		this.options = defaults(opts, {
			trails: false,
			trailLength: 50,
			trailFade: false,
			trailSpace: 5,
			motionBlur: 0,
			debug: false
		});
		this.el = document.createElement('canvas');
		this.el.style.display = 'block';
		this.ctx = this.el.getContext('2d');
		this.frame = 0;
		this.following = null;
		this.camera = new Vec2(0, 0);
	}

	follow(entity) {
		if (entity instanceof Entity) {
			this.following = entity;
		}
	}

	unfollow() {
		this.following = null;
	}

	centerView() {
		let centerX, centerY;

		if (this.following !== null) {
			centerX = this.following.position.x - this.ctx.canvas.width / 2;
			centerY = this.following.position.y - this.ctx.canvas.height / 2;
			this.camera.set(centerX, centerY);
		}
	}

	setCursor(cursor) {
		let currentCursor = this.el.dataset.cursor;
		if (currentCursor !== cursor) {
			this.el.dataset.cursor = cursor;
		}
	}

	render(entities, constraints, input, selectedEntities, isolatedEntity, stats, params, tool, simOpts) {
		let KE, PE, TE, Xend, Yend, e, m, momentum, p1, p2, unv, uv, v, inRadius, willSelect, isSelected, selectTool, canSelect, x, y, i, j, len, altCursor, entityAlpha;

		this.ctx.fillStyle = `rgba(0, 0, 0, ${1 - this.options.motionBlur})`;
		this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
		// this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
		entityAlpha = isolatedEntity !== null ? 0.25 : 1.0;
		
		// Only increment lineDashOffset once per frame
		this.ctx.lineDashOffset = (this.ctx.lineDashOffset + 0.5) % 10;

		this.centerView();

		if (simOpts.bounded) {
			this.ctx.save();
			this.ctx.strokeStyle = '#444444';
			this.ctx.lineWidth = 8;
			this.ctx.strokeRect(simOpts.bounds.left - this.camera.x, simOpts.bounds.top - this.camera.y,
				simOpts.bounds.width, simOpts.bounds.height);
			this.ctx.restore();
		}

		altCursor = false;

		this.ctx.save();
		this.ctx.translate(-this.camera.x, -this.camera.y);
		this.ctx.globalAlpha = entityAlpha;
		for (i = 0, len = constraints.length; i < len; ++i) {
			constraints[i].draw(this.ctx);
		}
		this.ctx.restore();

		this.ctx.save();
		this.ctx.translate(-this.camera.x, -this.camera.y);
		this.ctx.globalAlpha = entityAlpha;
		for (i = 0, len = entities.length; i < len; ++i) {
			e = entities[i];

			if (e.willDelete) { continue; }

			// e.draw(this.ctx, e === isolatedEntity);

			// Mouse interaction
			m = new Vec2(input.mouse.x, input.mouse.y);
			selectTool = tool._current === tool.SELECT;
			canSelect = input.mouse.dragStartedInCanvas && input.mouse.isDown;
			inRadius = m.distSq(e.position.subtract(this.camera)) < e.radius * e.radius && selectTool && input.mouse.isOverCanvas;
			willSelect = e.inRegion(
				input.mouse.dragStartX + this.camera.x,
				input.mouse.dragStartY + this.camera.y,
				input.mouse.dragX, input.mouse.dragY
			) && input.mouse.isDown && selectTool && canSelect;
			isSelected = selectedEntities.has(e);

			// Set flag if current entity is under mouse pointer
			if (inRadius && !input.mouse.isDown) { altCursor = true; }

			// Draw entity (pass if selected or will select)
			e.draw(this.ctx, inRadius || willSelect || isSelected);

			// Draw isolated entity focus ring
			if (e === isolatedEntity) {
				this.ctx.save();
				this.ctx.globalAlpha = 1.0;
				this.ctx.strokeStyle = isSelected ? '#FFFFFF' : '#00ACED';
				this.ctx.lineWidth = 2;
				this.ctx.setLineDash([5]);
				this.ctx.beginPath();
				this.ctx.arc(e.position.x, e.position.y, e.radius + 4, 0, 2 * Math.PI, false);
				this.ctx.closePath();
				this.ctx.stroke();
				this.ctx.restore();
			}

			// Trail Vectors
			if (this.options.trails && e instanceof Particle) {
				// Add new positions
				if (this.frame % this.options.trailSpace === 0) {
					e.trailX.unshift(e.position.x);
					e.trailY.unshift(e.position.y);
				}
				// Prune excess trails
				while (e.trailX.length > this.options.trailLength) { e.trailX.pop(); }
				while (e.trailY.length > this.options.trailLength) { e.trailY.pop(); }

				this.ctx.lineWidth = 2;
				this.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
				this.ctx.save();

				for (j = 1; j < this.options.trailLength; ++j) {
					this.ctx.beginPath();
					if (this.options.trailFade) {
						this.ctx.globalAlpha = entityAlpha * (1 - j / e.trailX.length);
					}
					this.ctx.moveTo(e.trailX[j - 1] - this.camera.x, e.trailY[j - 1]);
					this.ctx.lineTo(e.trailX[j] - this.camera.x, e.trailY[j]);
					this.ctx.stroke();
				}
				this.ctx.restore();
			}

			if (this.options.debug) { e.debug(this.ctx); }
		}
		this.ctx.restore();

		// Mouse drag
		if (input.mouse.dragStartedInCanvas) {
			switch (tool._current) {
			case tool.SELECT:
				if (input.mouse.isDown) {
					let x0 = input.mouse.dragStartX;
					let x1 = x0 + input.mouse.dragX;
					[x0, x1] = [Math.min(x0, x1), Math.max(x0, x1)];
					let y0 = input.mouse.dragStartY;
					let y1 = y0 + input.mouse.dragY;
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

					v = new Vec2(input.mouse.dragX, input.mouse.dragY);
					uv = v.normalize();
					unv = new Vec2(-uv.y, uv.x);

					p1 = v.subtract(uv.subtract(unv).scale(10));
					p2 = p1.subtract(unv.scale(20));

					Xend = input.mouse.dragStartX + input.mouse.dragX;
					Yend = input.mouse.dragStartY + input.mouse.dragY;

					this.ctx.strokeStyle = 'rgba(255,0,0,1)';

					this.ctx.beginPath();
					this.ctx.moveTo(input.mouse.dragStartX, input.mouse.dragStartY);
					this.ctx.lineTo(Xend, Yend);
					this.ctx.lineTo(input.mouse.dragStartX + p1.x, input.mouse.dragStartY + p1.y);
					this.ctx.moveTo(input.mouse.dragStartX + p2.x, input.mouse.dragStartY + p2.y);
					this.ctx.lineTo(Xend, Yend);
					this.ctx.stroke();

					// Create entity preview around drag start
					this.ctx.strokeStyle = 'rgba(128,128,128,1)';
					this.ctx.beginPath();
					this.ctx.arc(x, y, Math.sqrt(params.createMass), 0, 2 * Math.PI, false);
					this.ctx.stroke();
				}
			}
		}
		if (tool._current === tool.CREATE &&
			input.mouse.isOverCanvas && !input.mouse.isDown) {
			// Create entity preview around cursor
			this.ctx.strokeStyle = 'rgba(128,128,128,1)';
			this.ctx.beginPath();
			this.ctx.arc(input.mouse.x, input.mouse.y, Math.sqrt(params.createMass), 0, 2 * Math.PI, false);
			this.ctx.stroke();
		}

		// TODO: use the state manager for this part?
		if (tool._current === tool.SELECT) {
			if (altCursor) { this.setCursor(tool._currentData.altCursor); }
			else { this.setCursor(tool._currentData.cursor); }
		}

		++this.frame;
	}
}
