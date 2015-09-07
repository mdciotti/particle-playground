import Simulator from './simulator.js';
import * as Gui from './gui.js';
import Clock from './clock.js';
import { Body } from './entity.js';
import CanvasRenderer from './canvas-renderer.js';
import { TaggedUnion } from './enum.js';
import Vec2 from './vec2.js';
import defaults from '../node_modules/defaults';

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
		this.gui = new Gui.Pane(this.el);
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
			SELECT: { cursor: 'default' },
			CREATE: { cursor: 'crosshair' },
			PAN: { cursor: 'move' },
			ZOOM: { cursor: 'zoom-in', altCursor: 'zoom-in' },
			GRAB: { cursor: 'grab', activeCursor: 'grabbing' }
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
			// console.log(e.layerX, e.layerY);
			this.input.mouse.isDown = true;
			this.input.mouse.dragStartX = e.layerX;
			this.input.mouse.dragStartY = e.layerY;
			this.input.mouse.dragX = 0;
			this.input.mouse.dragY = 0;
			this.input.mouse.dx = 0;
			this.input.mouse.dy = 0;
		};
		this.events.mousemove = function(e) {
			this.input.mouse.dx = e.layerX - this.input.mouse.x;
			this.input.mouse.dy = e.layerY - this.input.mouse.y;
			this.input.mouse.dragX = e.layerX - this.input.mouse.dragStartX;
			this.input.mouse.dragY = e.layerY - this.input.mouse.dragStartY;
			this.input.mouse.x = e.layerX;
			this.input.mouse.y = e.layerY;

			switch (this.tool._current) {
				case this.tool.GRAB:
					if (this.input.mouse.isDown) {
						// console.log(e);
						let delta = new Vec2(this.input.mouse.dx, this.input.mouse.dy);
						this.selectedEntities.forEach(entity => {
							entity.position.addSelf(delta);
						});
					}
					break;
			}
		};
		this.events.mousewheel = function(e) {
			this.input.mouse.wheel = e.wheelDelta;
			this.simulator.parameters.createMass = Math.max(10, this.simulator.parameters.createMass + e.wheelDelta / 10);
		};
		this.events.mouseup = function(e) {
			let particle;
			this.input.mouse.isDown = false;
			this.input.mouse.dragX = e.layerX - this.input.mouse.dragStartX;
			this.input.mouse.dragY = e.layerY - this.input.mouse.dragStartY;

			switch (this.tool._current) {
				case this.tool.CREATE:
					particle = new Body(
						this.input.mouse.dragStartX,
						this.input.mouse.dragStartY,
						this.simulator.parameters.createMass,
						this.input.mouse.dragX / 50,
						this.input.mouse.dragY / 50
					);
					this.simulator.entities.push(particle);
					this.selectedEntities = [particle];
					this.events.selection(this.selectedEntities);
					break;

				case this.tool.SELECT:
					this.selectRegion(this.input.mouse.dragStartX, this.input.mouse.dragStartY,
						this.input.mouse.dragX, this.input.mouse.dragY
					);
					break;

				case this.tool.GRAB:
					// Apply velocity to selected entities
					break;
			}
		};
		this.events.selection = function(entities) {};

		// Attach event handlers
		window.addEventListener('resize', this.events.resize.bind(this));
		document.body.addEventListener('contextmenu', this.events.contextmenu.bind(this));
		this.renderer.el.addEventListener('mousedown', this.events.mousedown.bind(this));
		this.renderer.el.addEventListener('mousemove', this.events.mousemove.bind(this));
		this.renderer.el.addEventListener('mouseup', this.events.mouseup.bind(this));
		this.renderer.el.addEventListener('mousewheel', this.events.mousewheel.bind(this));
	}

	listen(eventName, handler) {
		this.events[eventName] = handler;
	}

	selectRegion(x, y, w, h) {
		this.selectedEntities.length = 0;

		this.selectedEntities = this.simulator.entities.filter(e => {
			return e.inRegion(x, y, w, h);
		});

		this.events.selection(this.selectedEntities);

		return this;
	}

	setTool(tool) {
		if (tool !== this.tool._current) {
			// this.input.mouse.lastTool = this.input.mouse.tool;
			this.tool.setCurrent(tool);
			this.renderer.el.style.cursor = this.tool._currentData.cursor;
		}
		return this;
	}

	start() {
		this.loop(1 / 60);
	}

	pause() {
		this.paused = !this.paused;
	}

	stop() {
		cancelAnimationFrame(this.animator);
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
			this.tool
		);
		// this.clock.tick();
	}
}
