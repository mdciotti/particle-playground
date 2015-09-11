import Simulator from './simulator.js';
import * as GUI from './gui/index.js';
import Clock from './clock.js';
import { Body } from './entity.js';
import CanvasRenderer from './canvas-renderer.js';
import { TaggedUnion } from './enum.js';
import Vec2 from './vec2.js';
import ModalOverlay from './modal-overlay.js';
import defaults from 'defaults';

// Webpack: load stylesheet
require('../assets/styles/playground.less');

let counter = 0;

export default class Playground {
	constructor(opts) {
		// Set default options
		this.options = defaults(opts, {
			container: document.body,
			width: window.innerWidth,
			height: window.innerHeight
		});
		this.animator = null;
		this.runtime = 0;
		this.running = false;
		this.paused = false;
		this.events = {};

		// Create DOM node
		this.el = document.createElement('div');
		this.el.classList.add('playground');
		this.el.id = `pg-${counter++}`;
		this.el.style.width = `${this.options.width}px`;
		this.el.style.height = `${this.options.height}px`;

		// Inject DOM node into container
		this.options.container.appendChild(this.el);

		// Initialize submodules
		this.clock = new Clock();
		this.gui = new GUI.Pane(this.el);
		this.simulator = new Simulator({
			bounds: { left: 0, top: 0, width: this.options.width - this.gui.width, height: this.options.height }
		});
		this.renderer = new CanvasRenderer();

		// Setup renderer DOM node
		this.renderer.el.width = this.el.clientWidth - this.gui.width;
		this.renderer.el.height = this.el.clientHeight;
		this.el.appendChild(this.renderer.el);

		// TODO: should this be stored as a member of Playground?
		this.selectedEntities = [];

		// Define tools (enum-like)
		// this.TOOL = new Enum('SELECT', 'CREATE', 'MOVE', 'ZOOM');
		this.tool = new TaggedUnion({
			SELECT: { cursor: 'default', altCursor: 'pointer' },
			CREATE: { cursor: 'crosshair' },
			PAN: { cursor: 'move' },
			ZOOM: { cursor: 'zoom-in', altCursor: 'zoom-out' },
			GRAB: { cursor: 'grab', altCursor: 'grabbing' },
			NONE: { cursor: 'not-allowed' }
		});

		// Input State
		this.input = {
			mouse: {
				x: 0, y: 0,
				dx: 0, dy: 0,
				dragX: 0, dragY: 0,
				dragStartX: 0, dragStartY: 0,
				isDown: false
			}
		};

		let wasPaused = this.paused;

		// Define Default Event Handlers
		this.on('contextmenu', e => {
			e.preventDefault();
			return false;
		});
		this.on('resize', () => {
			this.simulator.options.bounds.width = this.renderer.ctx.canvas.width = window.innerWidth - this.gui.width;
			this.simulator.options.bounds.height = this.renderer.ctx.canvas.height = window.innerHeight;
		});
		this.on('blur', () => {
			wasPaused = this.paused;
			this.pause(true);
		});
		this.on('focus', () => {
			if (!wasPaused) { this.pause(false); }
		});
		this.on('mousedown', e => {
			// console.log(e.layerX, e.layerY);
			this.input.mouse.isDown = true;
			this.input.mouse.dragStartX = e.layerX;
			this.input.mouse.dragStartY = e.layerY;
			this.input.mouse.dragX = 0;
			this.input.mouse.dragY = 0;
			this.input.mouse.dx = 0;
			this.input.mouse.dy = 0;

			switch (this.tool._current) {
			case this.tool.PAN:
				if (this.renderer.following !== null) { this.renderer.unfollow(); }
				break;

			case this.tool.GRAB:
				this.renderer.setAltCursor(this.tool);
				this.selectedEntities.forEach(entity => {
					entity._fixed = entity.fixed;
					entity.fixed = true;
				});
				break;
			}
		});
		this.on('mousemove', e => {
			if (!this.running) { return; }
			let delta;
			this.input.mouse.dx = e.layerX - this.input.mouse.x;
			this.input.mouse.dy = e.layerY - this.input.mouse.y;
			this.input.mouse.dragX = e.layerX - this.input.mouse.dragStartX;
			this.input.mouse.dragY = e.layerY - this.input.mouse.dragStartY;
			this.input.mouse.x = e.layerX;
			this.input.mouse.y = e.layerY;

			switch (this.tool._current) {
				case this.tool.PAN:
					if (this.input.mouse.isDown) {
						delta = new Vec2(this.input.mouse.dx, this.input.mouse.dy);
						this.renderer.camera.subtractSelf(delta);
					}
					break;

				case this.tool.GRAB:
					if (this.input.mouse.isDown) {
						delta = new Vec2(this.input.mouse.dx, this.input.mouse.dy);
						this.selectedEntities.forEach(entity => {
							entity.position.addSelf(delta);
							entity.velocity.set(delta.x, delta.y);
						});
					}
					break;
			}
		});
		this.on('mousewheel', e => {
			if (!this.running) { return; }
			this.input.mouse.wheel = e.wheelDelta;
			this.simulator.parameters.createMass = Math.max(10, this.simulator.parameters.createMass + e.wheelDelta / 10);
		});
		this.on('mouseup', e => {
			if (!this.running) { return; }
			let particle;
			this.input.mouse.isDown = false;
			this.input.mouse.dragX = e.layerX - this.input.mouse.dragStartX;
			this.input.mouse.dragY = e.layerY - this.input.mouse.dragStartY;

			switch (this.tool._current) {
				case this.tool.CREATE:
					particle = new Body(
						this.input.mouse.dragStartX + this.renderer.camera.x,
						this.input.mouse.dragStartY + this.renderer.camera.y,
						this.simulator.parameters.createMass,
						this.input.mouse.dragX / 50,
						this.input.mouse.dragY / 50
					);
					this.simulator.entities.push(particle);
					this.selectedEntities = [particle];
					this.dispatch('selection', this.selectedEntities);
					break;

				case this.tool.SELECT:
					this.selectRegion(
						this.input.mouse.dragStartX + this.renderer.camera.x,
						this.input.mouse.dragStartY + this.renderer.camera.y,
						this.input.mouse.dragX, this.input.mouse.dragY
					);
					break;

				case this.tool.GRAB:
					this.renderer.setCursor(this.tool);
					this.selectedEntities.forEach(entity => {
						entity.fixed = entity._fixed;
					});
					break;
			}
		});

		// Attach event handlers
		window.addEventListener('resize', e => { this.dispatch('resize', e); });
		window.addEventListener('focus', e => { this.dispatch('focus', e); });
		window.addEventListener('blur', e => { this.dispatch('blur', e); });
		document.body.addEventListener('contextmenu', e => { this.dispatch('contextmenu', e); });
		this.renderer.el.addEventListener('mousedown', e => { this.dispatch('mousedown', e); });
		this.renderer.el.addEventListener('mousemove', e => { this.dispatch('mousemove', e); });
		this.renderer.el.addEventListener('mouseup', e => { this.dispatch('mouseup', e); });
		this.renderer.el.addEventListener('mousewheel', e => { this.dispatch('mousewheel', e); });
	}

	dispatch(eventName, data) {
		if (!this.running) { return; }
		// TODO: maybe handle multiple arguments?
		if (!this.events.hasOwnProperty(eventName)) { return; }
		// this.events[eventName].forEach(listener => { listener(data); });
		for (var [handle, listener] of this.events[eventName]) {
			listener(data);
		}
	}

	/**
	 * Attaches an event listener and returns a Symbol reference to the
	 * listener.
	 * @param  {String}   eventName The name of the event to listen for
	 * @param  {Function} listener  The function to be called on the event
	 * @return {Symbol}
	 */
	on(eventName, listener) {
		let handle = Symbol();
		if (!this.events.hasOwnProperty(eventName)) {
			this.events[eventName] = new Map();
		}
		this.events[eventName].set(handle, listener);
		return handle;
	}

	/**
	 * Removes an event listener by the Symbol reference to the listener
	 * returned from calling {@link Playground#on}.
	 * @param  {String} eventName The name of the event to remove from
	 * @param  {Symbol} handle    The reference to the event listener
	 */
	off(eventName, handle) {
		if (this.events.hasOwnProperty(eventName)) {
			delete this.events[eventName].delete(handle);
		}
	}

	selectRegion(x, y, w, h) {
		this.selectedEntities.length = 0;

		this.selectedEntities = this.simulator.entities.filter(e => {
			return e.inRegion(x, y, w, h);
		});

		this.dispatch('selection', this.selectedEntities);

		return this;
	}

	deselect() {
		this.selectedEntities.length = 0;
		this.dispatch('selection', this.selectedEntities);
	}

	setTool(tool) {
		if (tool !== this.tool._current) {
			this.tool.setCurrent(tool);
			this.renderer.setCursor(this.tool);
		}
		return this;
	}

	start() {
		if (!this.running) {
			this.running = true;
			this.loop(1 / 60);
		}
	}

	pause(state) {
		if (state !== null && typeof state === 'boolean') {
			this.paused = state;
		} else {
			this.paused = !this.paused;
		}
		if (this.paused) { this.dispatch('pause'); }
		else { this.dispatch('resume'); }
	}

	stop() {
		this.gui.disableAll();
		this.running = false;
		cancelAnimationFrame(this.animator);
		this.setTool(this.tool.NONE);
		this.deselect();

		let refreshMessage = new ModalOverlay({
			// title: 'Simulation stopped',
			message: '<p>Reload the page to restart the simulation.</p>',
			icon: 'none',
			actions: [
				{ text: 'Cancel', soft: true, onclick: (e) => { refreshMessage.destroy(); } },
				{ text: 'Reload', key: '<enter>', default: true, onclick: (e) => { document.location.reload(); } }
			],
			onopen: () => { this.el.classList.add('defocus'); },
			onclose: () => { this.el.classList.remove('defocus'); }
		});
		refreshMessage.appendTo(document.body);
	}

	reset() {
		this.simulator.reset();
		this.deselect();
	}

	loop(t) {
		let dt = (t - this.runtime) / 10;
		this.runtime = t;
		this.animator = requestAnimationFrame(this.loop.bind(this));
		if (!this.paused) { this.simulator.update(dt); }
		this.renderer.render(
			this.simulator.entities,
			this.input,
			this.selectedEntities,
			this.simulator.stats,
			this.simulator.parameters,
			this.tool,
			this.simulator.options
		);
		// this.clock.tick();
	}
}
