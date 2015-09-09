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

		// Define Event Handlers
		this.events = {};
		this.events.contextmenu = function(e) {
			e.preventDefault();
			return false;
		};
		this.events.resize = function() {
			this.simulator.options.bounds.width = this.renderer.ctx.canvas.width = window.innerWidth - this.gui.width;
			this.simulator.options.bounds.height = this.renderer.ctx.canvas.height = window.innerHeight;
		};
		this.events.mousedown = function(e) {
			if (!this.running) { return; }
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
		};
		this.events.mousemove = function(e) {
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
		};
		this.events.mousewheel = function(e) {
			if (!this.running) { return; }
			this.input.mouse.wheel = e.wheelDelta;
			this.simulator.parameters.createMass = Math.max(10, this.simulator.parameters.createMass + e.wheelDelta / 10);
		};
		this.events.mouseup = function(e) {
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
					this.events.selection(this.selectedEntities);
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
		};
		this.events.selection = function(entities) {};
		this.events.pause = function () {};
		this.events.resume = function () {};

		// Attach event handlers
		window.addEventListener('resize', this.events.resize.bind(this));
		document.body.addEventListener('contextmenu', this.events.contextmenu.bind(this));
		this.renderer.el.addEventListener('mousedown', this.events.mousedown.bind(this));
		this.renderer.el.addEventListener('mousemove', this.events.mousemove.bind(this));
		this.renderer.el.addEventListener('mouseup', this.events.mouseup.bind(this));
		this.renderer.el.addEventListener('mousewheel', this.events.mousewheel.bind(this));
	}

	on(eventName, handler) {
		this.events[eventName] = handler;
	}

	off(eventName) {
		if (this.events.hasOwnProperty(eventName)) {
			this.events[eventName] = function () {};
		}
	}

	selectRegion(x, y, w, h) {
		this.selectedEntities.length = 0;

		this.selectedEntities = this.simulator.entities.filter(e => {
			return e.inRegion(x, y, w, h);
		});

		this.events.selection(this.selectedEntities);

		return this;
	}

	deselect() {
		this.selectedEntities.length = 0;
		this.events.selection(this.selectedEntities);
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

	pause() {
		this.paused = !this.paused;
		if (this.paused) { this.events.pause(); }
		else { this.events.resume(); }
	}

	stop() {
		this.gui.disableAll();
		this.running = false;
		cancelAnimationFrame(this.animator);
		this.setTool(this.tool.NONE);
		this.deselect();

		let refreshMessage = new ModalOverlay(
			'Simulation stopped',
			'Reload the page to restart the simulation.',
			[
				{ text: 'Cancel', soft: true, onclick: (e) => { refreshMessage.destroy(); } },
				{ text: 'Reload', onclick: (e) => { document.location.reload(); } }
			],
			'ion-ios-refresh-outline'
		);
		refreshMessage.appendTo(this.el);

		// Blur background
		this.el.classList.add('defocus');
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
