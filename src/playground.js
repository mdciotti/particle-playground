import Simulator from './simulator.js';
import * as GUI from './gui/index.js';
import Clock from './clock.js';
import Body from './body.js';
import CanvasRenderer from './canvas-renderer.js';
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
			height: window.innerHeight,
			pauseOnBlur: true,
			disableRightClickMenu: true
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
		if (this.options.disableRightClickMenu) {
			this.on('contextmenu', e => {
				e.preventDefault();
				return false;
			});
		}
		this.on('resize', () => {
			this.el.style.width = `${window.innerWidth}px`;
			this.el.style.height = `${window.innerHeight}px`;
			this.simulator.options.bounds.width = this.renderer.ctx.canvas.width = window.innerWidth - this.gui.width;
			this.simulator.options.bounds.height = this.renderer.ctx.canvas.height = window.innerHeight;
		});
		if (this.options.pauseOnBlur) {
			this.on('blur', () => {
				wasPaused = this.paused;
				this.pause(true);
			});
			this.on('focus', () => {
				if (!wasPaused) { this.pause(false); }
			});
		}
		this.on('mousedown', e => {
			// console.log(e.layerX, e.layerY);
			this.input.mouse.isDown = true;
			this.input.mouse.dragStartX = e.layerX;
			this.input.mouse.dragStartY = e.layerY;
			this.input.mouse.dragX = 0;
			this.input.mouse.dragY = 0;
			this.input.mouse.dx = 0;
			this.input.mouse.dy = 0;
		});
		this.on('mousemove', e => {
			this.input.mouse.dx = e.layerX - this.input.mouse.x;
			this.input.mouse.dy = e.layerY - this.input.mouse.y;
			this.input.mouse.dragX = e.layerX - this.input.mouse.dragStartX;
			this.input.mouse.dragY = e.layerY - this.input.mouse.dragStartY;
			this.input.mouse.x = e.layerX;
			this.input.mouse.y = e.layerY;
		});
		this.on('mousewheel', e => {
			this.input.mouse.wheel = e.wheelDelta;
		});
		this.on('mouseup', e => {
			this.input.mouse.isDown = false;
			this.input.mouse.dragX = e.layerX - this.input.mouse.dragStartX;
			this.input.mouse.dragY = e.layerY - this.input.mouse.dragStartY;
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

	start() {
		if (!this.running) {
			this.running = true;
			this.loop(1 / 60);
		}
		this.dispatch('start');
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
		cancelAnimationFrame(this.animator);
		this.dispatch('stop');
		this.running = false;
	}

	reset() {
		this.simulator.reset();
		this.dispatch('reset');
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
		// this.dispatch('tick');
	}
}
