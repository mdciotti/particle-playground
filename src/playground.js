import Simulator from './simulator.js';
import * as Gui from './gui.js';
import Clock from './clock.js';
import { Body } from './entity.js';
import CanvasRenderer from './canvas-renderer.js';
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

		// Define tools
		this.tools = {};
		this.tools.SELECT = { cursor: 'default' };
		this.tools.CREATE = { cursor: 'crosshair' };
		this.tools.MOVE = { cursor: 'grab', activeCursor: 'grabbing' };
		this.tools.ZOOM = { cursor: 'zoom-in', altCursor: 'zoom-in' };

		// Input State
		this.input = {
			mouse: {
				x: 0,
				y: 0,
				dx: 0,
				dy: 0,
				dragStartX: 0,
				dragStartY: 0,
				isDown: false,
				tool: null,
				lastTool: 'CREATE'
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
			this.input.mouse.dx = 0;
			this.input.mouse.dy = 0;
		};
		this.events.mousemove = function(e) {
			this.input.mouse.dx = e.layerX - this.input.mouse.dragStartX;
			this.input.mouse.dy = e.layerY - this.input.mouse.dragStartY;
			this.input.mouse.x = e.layerX;
			this.input.mouse.y = e.layerY;
		};
		this.events.mousewheel = function(e) {
			this.input.mouse.wheel = e.wheelDelta;
			this.simulator.parameters.createMass = Math.max(10, this.simulator.parameters.createMass + e.wheelDelta / 10);
		};
		this.events.mouseup = function(e) {
			this.input.mouse.isDown = false;
			this.input.mouse.dx = e.layerX - this.input.mouse.dragStartX;
			this.input.mouse.dy = e.layerY - this.input.mouse.dragStartY;
			switch (this.input.mouse.tool) {
				case 'CREATE':
					this.simulator.entities.push(new Body(
						this.input.mouse.dragStartX,
						this.input.mouse.dragStartY,
						this.simulator.parameters.createMass,
						this.input.mouse.dx / 50,
						this.input.mouse.dy / 50
					));
					break;
				case 'SELECT':
					this.selectRegion(this.input.mouse.dragStartX, this.input.mouse.dragStartY,
						this.input.mouse.dx, this.input.mouse.dy
					);
					break;
			}
		};

		// Attach event handlers
		window.addEventListener('resize', this.events.resize.bind(this));
		document.body.addEventListener('contextmenu', this.events.contextmenu.bind(this));
		this.renderer.el.addEventListener('mousedown', this.events.mousedown.bind(this));
		this.renderer.el.addEventListener('mousemove', this.events.mousemove.bind(this));
		this.renderer.el.addEventListener('mouseup', this.events.mouseup.bind(this));
		this.renderer.el.addEventListener('mousewheel', this.events.mousewheel.bind(this));
	}

	selectRegion(x, y, w, h) {
		let e, e_x, e_y, i, idx, withinX, withinY;

		this.selectedEntities.length = 0;
		this.selectedEntities = [];

		if (this.input.mouse.dx === 0 && this.input.mouse.dy === 0) {
			return this;
		}

		[x, w] = [Math.min(x, w), Math.max(x, w)];
		[y, h] = [Math.min(y, h), Math.max(y, h)];

		let len = this.simulator.entities.length;
		for (i = 0; i < len; i++) {
			e = this.simulator.entities[i];
			e_x = e.position.x;
			e_y = e.position.y;

			withinX = x - e.radius < e_x && e_x < x + w + e.radius;
			withinY = y - e.radius < e_y && e_y < y + h + e.radius;

			if (withinX && withinY) {
				this.selectedEntities.push(e);
			} else {
				idx = this.selectedEntities.indexOf(e);
				if (idx > 0) {
					this.selectedEntities.splice(idx, 1);
				}
			}
		}
		return this;
	}

	setTool(tool) {
		if (tool !== this.input.mouse.tool) {
			this.input.mouse.lastTool = this.input.mouse.tool;
			this.input.mouse.tool = tool;
			this.renderer.el.style.cursor = this.tools[tool].cursor;
		}
		return this;
	}

	toggleTool() {
		this.setTool(this.input.mouse.lastTool);
		return this;
	}

	start() {
		// this.clock.register(this.simulator.update.bind(this.simulator, this.clock.dt));
		// this.clock.register(this.renderer.render.bind(
		// 	this.renderer,
		// 	this.simulator.entities,
		// 	this.input,
		// 	this.selectedEntities,
		// 	this.simulator.stats,
		// 	this.simulator.parameters
		// ));
		this.loop(1 / 60);
	}

	stop() {
		cancelAnimationFrame(this.animator);
	}

	loop(t) {
		let dt = (t - this.runtime) / 10;
		this.runtime = t;
		this.animator = requestAnimationFrame(this.loop.bind(this));
		this.simulator.update(dt);
		this.renderer.render(
			this.simulator.entities,
			this.input,
			this.selectedEntities,
			this.simulator.stats,
			this.simulator.parameters
		);
		// this.clock.tick();
	}
}
