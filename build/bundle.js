/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*****************!*\
  !*** ./main.js ***!
  \*****************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	var _srcGuiJs = __webpack_require__(/*! ./src/gui.js */ 5);
	
	var Gui = _interopRequireWildcard(_srcGuiJs);
	
	var _srcPlaygroundJs = __webpack_require__(/*! ./src/playground.js */ 18);
	
	var _srcPlaygroundJs2 = _interopRequireDefault(_srcPlaygroundJs);
	
	var _srcPlotJs = __webpack_require__(/*! ./src/plot.js */ 29);
	
	var _srcPlotJs2 = _interopRequireDefault(_srcPlotJs);
	
	var _srcEntityJs = __webpack_require__(/*! ./src/entity.js */ 22);
	
	var _srcModalOverlayJs = __webpack_require__(/*! ./src/modal-overlay.js */ 26);
	
	var _srcModalOverlayJs2 = _interopRequireDefault(_srcModalOverlayJs);
	
	window.addEventListener('load', function () {
		window.p = new _srcPlaygroundJs2['default']({
			container: document.body
		});
	
		// Create GUI
		var infoBin = undefined,
		    info = undefined,
		    player = undefined,
		    playerActions = undefined,
		    toolBin = undefined,
		    tools = undefined,
		    propertiesBin = undefined,
		    physicsBin = undefined,
		    gravity = undefined,
		    friction = undefined,
		    bounded = undefined,
		    collisions = undefined,
		    appearance = undefined,
		    trails = undefined,
		    trailLength = undefined,
		    trailFade = undefined,
		    motionBlur = undefined,
		    vectors = undefined,
		    statsBin = undefined,
		    ke = undefined,
		    pe = undefined,
		    te = undefined,
		    momentum = undefined,
		    canvas = undefined;
	
		infoBin = new Gui.Bin('Information', 'html');
		infoBin.height = 16;
		info = new Gui.HTMLController('Introduction', null);
		info.setHTML('<h1>Particle Playground</h1>' + '<p>This is a sandbox for simulating 2D particle physics. Play around to see what you can do!</p>' + '<hr>' + '<small>Created by <a href="https://twitter.com/mdciotti" target="_blank">@mdciotti</a> // ' + '<a href="https://github.com/mdciotti/particle-playground" target="_blank">v0.1.0-alpha</a></small>');
		infoBin.addController(info);
		p.gui.addBin(infoBin);
	
		player = new Gui.Bin('Simulation', 'grid');
		playerActions = new Gui.GridController('playerActions', [{ tooltip: 'pause', disabled: false, icon: 'ion-ios-pause-outline', shortcut: 'P',
			tooltip_alt: 'resume', icon_alt: 'ion-ios-play-outline', type: 'toggle',
			onchange: function onchange() {
				p.pause();
			}
		}, { tooltip: 'stop', disabled: false, icon: 'ion-ios-close-outline', shortcut: '[ESC]', type: 'action',
			action: function action() {
				this.toggle(0);
				p.gui.disableAll();
				p.stop();
			}
		}, { tooltip: 'reset', disabled: false, icon: 'ion-ios-reload', shortcut: 'R', type: 'action', action: function action() {
				p.reset();
			} }], { type: 'mixed' });
		player.addController(playerActions);
		p.gui.addBin(player);
	
		toolBin = new Gui.Bin('Tools', 'grid');
		tools = new Gui.GridController('tools', [{ tooltip: 'create', selected: true, disabled: false, icon: 'ion-ios-plus-outline', shortcut: 'C', onselect: function onselect() {
				p.setTool(p.tool.CREATE);
			} }, { tooltip: 'select', selected: false, disabled: false, icon: 'ion-ios-crop', shortcut: 'S', onselect: function onselect() {
				p.setTool(p.tool.SELECT);
			} }, { tooltip: 'pan', selected: false, disabled: false, icon: 'ion-arrow-move', shortcut: 'P', onselect: function onselect() {
				p.setTool(p.tool.PAN);
			} }, { tooltip: 'zoom', selected: false, disabled: true, icon: 'ion-ios-search', shortcut: 'Z', onselect: function onselect() {
				p.setTool(p.tool.ZOOM);
			} }, { tooltip: 'grab', selected: false, disabled: false, icon: 'ion-android-hand', shortcut: 'G', onselect: function onselect() {
				p.setTool(p.tool.GRAB);
			} }]);
		toolBin.addController(tools);
		p.gui.addBin(toolBin);
	
		propertiesBin = new Gui.Bin('Properties', 'list');
		p.gui.addBin(propertiesBin);
	
		physicsBin = new Gui.Bin('Physics', 'list');
		gravity = new Gui.ToggleController('gravity', p.simulator.options.gravity, { onchange: function onchange(val) {
				p.simulator.options.gravity = val;
			} });
		friction = new Gui.NumberController('friction', p.simulator.options.friction, { min: 0, onchange: function onchange(val) {
				p.simulator.options.friction = val;
			} });
		bounded = new Gui.ToggleController('bounded', p.simulator.options.bounded, { onchange: function onchange(val) {
				p.simulator.options.bounded = val;
			} });
		collisions = new Gui.DropdownController('collisions', [{ value: 'none', selected: false, disabled: false }, { value: 'elastic', selected: true, disabled: false }, { value: 'merge', selected: false, disabled: false }, { value: 'pass', selected: false, disabled: true, name: 'pass through' }, { value: 'absorb', selected: false, disabled: false }, { value: 'shatter', selected: false, disabled: false }, { value: 'explode', selected: false, disabled: false }], { onselect: function onselect(val) {
				p.simulator.options.collisions = val;
			} });
		physicsBin.addControllers(gravity, friction, bounded, collisions);
		p.gui.addBin(physicsBin);
	
		appearance = new Gui.Bin('Appearance', 'list', false);
		trails = new Gui.ToggleController('trails', p.renderer.options.trails, { onchange: function onchange(val) {
				p.renderer.options.trails = val;
			} });
		trailLength = new Gui.NumberController('trail length', p.renderer.options.trailLength, { min: 0, max: 100, step: 5, onchange: function onchange(val) {
				p.renderer.options.trailLength = val;
			} });
		trailFade = new Gui.ToggleController('trail fade', p.renderer.options.trailFade, { onchange: function onchange(val) {
				p.renderer.options.trailFade = val;
			} });
		motionBlur = new Gui.NumberController('motion blur', p.renderer.options.motionBlur, { min: 0, max: 1, step: 0.1, onchange: function onchange(val) {
				p.renderer.options.motionBlur = val;
			} });
		vectors = new Gui.ToggleController('vectors', p.renderer.options.debug, { onchange: function onchange(val) {
				p.renderer.options.debug = val;
			} });
		appearance.addControllers(trails, trailLength, trailFade, motionBlur, vectors);
		p.gui.addBin(appearance);
	
		function getKE() {
			return p.simulator.stats.totalKineticEnergy;
		}
		function getPE() {
			return p.simulator.stats.totalPotentialEnergy;
		}
		function getTE() {
			return p.simulator.stats.totalPotentialEnergy + p.simulator.stats.totalKineticEnergy + p.simulator.stats.totalHeat;
		}
		function getMomentum() {
			return p.simulator.stats.totalMomentum;
		}
	
		statsBin = new Gui.Bin('Stats', 'list', false);
		ke = new Gui.InfoController('Kinetic Energy', getKE, { interval: 100, format: 'number' });
		pe = new Gui.InfoController('Potential Energy', getPE, { interval: 100, format: 'number' });
		te = new Gui.InfoController('Total Energy', getTE, { interval: 100, format: 'number' });
		momentum = new Gui.InfoController('Momentum', getMomentum, { interval: 100 });
		canvas = new Gui.CanvasController();
		statsBin.addControllers(ke, pe, te, momentum, canvas);
		p.gui.addBin(statsBin);
	
		var plot1 = new _srcPlotJs2['default'](canvas.ctx);
		plot1.addSeries('KE', '#00aced', 1000, getKE);
		plot1.addSeries('PE', '#ed00ac', 1000, getPE);
		plot1.addSeries('TE', '#ededed', 1000, getTE);
	
		function setEntityControllers(entities) {
			propertiesBin.removeAllControllers();
			if (entities.length === 0) {
				return;
			}
			var e = undefined,
			    name = undefined,
			    xpos = undefined,
			    ypos = undefined,
			    color = undefined,
			    mass = undefined,
			    fixed = undefined,
			    collidable = undefined,
			    follow = undefined,
			    remove = undefined;
	
			e = entities[0];
			name = new Gui.TextController('name', e.name, { onchange: function onchange(val) {
					e.name = val;
				} });
			xpos = new Gui.NumberController('pos.x', e.position.x, { decimals: 1, onchange: function onchange(val) {
					e.position.x = val;
				} }).watch(function () {
				return e.position.x;
			});
			ypos = new Gui.NumberController('pos.y', e.position.y, { decimals: 1, onchange: function onchange(val) {
					e.position.y = val;
				} }).watch(function () {
				return e.position.y;
			});
			color = new Gui.ColorController('color', e.color, { onchange: function onchange(val) {
					e.color = val;
				} });
			propertiesBin.addControllers(name, xpos, ypos, color);
			if (e instanceof _srcEntityJs.Body) {
				mass = new Gui.NumberController('mass', e.mass, { decimals: 0, onchange: function onchange(val) {
						e.setMass(val);
					} }).watch(function () {
					return e.mass;
				});
				fixed = new Gui.ToggleController('fixed', e.fixed, { onchange: function onchange(val) {
						e.fixed = val;
					} });
				collidable = new Gui.ToggleController('collidable', !e.ignoreCollisions, { onchange: function onchange(val) {
						e.ignoreCollisions = !val;
					} });
				propertiesBin.addControllers(mass, fixed, collidable);
			}
			follow = new Gui.ActionController('follow', { action: function action() {
					p.renderer.follow(e);
				} });
			remove = new Gui.ActionController('delete', { action: function action() {
					e.willDelete = true;
					propertiesBin.removeAllControllers();
					entities.splice(0, 1);
					setEntityControllers(entities);
				} });
			propertiesBin.addControllers(follow, remove);
	
			p.listen('pause', function () {
				xpos.unwatch();
				ypos.unwatch();
				mass.unwatch();
			});
			p.listen('resume', function () {
				xpos.rewatch();
				ypos.rewatch();
				mass.rewatch();
			});
		}
	
		// Update properties bin on selection
		p.listen('selection', setEntityControllers);
	
		p.setTool(p.tool.CREATE);
		// p.start();
	
		var startInfo = new _srcModalOverlayJs2['default']('Particle Playground', 'This is a sandbox for simulating 2D particle physics. Play around to see what you can do!', [{ text: 'Hide', soft: true, onclick: function onclick(e) {/* TODO: set localstorage setings */} }, { text: 'Start', onclick: function onclick(e) {
				startInfo.destroy();p.start();
			} }], 'ion-ionic');
		startInfo.appendTo(p.el);
	});

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/*!********************!*\
  !*** ./src/gui.js ***!
  \********************/
/***/ function(module, exports, __webpack_require__) {

	// GRAPHICAL USER INTERFACE CONTROLLER
	
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _node_modulesDefaults = __webpack_require__(/*! ../~/defaults */ 6);
	
	var _node_modulesDefaults2 = _interopRequireDefault(_node_modulesDefaults);
	
	// import defaults from '~defaults/index.js';
	
	// Webpack: load stylesheet
	__webpack_require__(/*! ../assets/styles/gui.less */ 12);
	
	var Bin = (function () {
		function Bin(title, type) {
			var _this = this;
	
			var open = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];
	
			_classCallCheck(this, Bin);
	
			this.title = title;
			this.type = type;
			this.height = 0;
			this.container = null;
			this.controllers = [];
			this.node = null;
			this.node = document.createElement('div');
			this.node.classList.add('bin');
	
			var titlebar = document.createElement('div');
			titlebar.classList.add('bin-title-bar');
			titlebar.addEventListener('click', function (e) {
				_this.toggle();
			});
	
			var icon = document.createElement('i');
			icon.classList.add('ion-ios-arrow-right');
			titlebar.appendChild(icon);
	
			var label = document.createElement('span');
			label.classList.add('bin-title');
			label.innerText = this.title;
			titlebar.appendChild(label);
	
			this.node.appendChild(titlebar);
	
			this.container = document.createElement('div');
			this.container.classList.add('bin-container');
			this.container.classList.add('bin-' + this.type);
			this.node.appendChild(this.container);
	
			this.setHeight(this.height);
	
			if (open) {
				this.open();
			}
		}
	
		_createClass(Bin, [{
			key: 'isOpen',
			value: function isOpen() {
				return this.node.classList.contains('open');
			}
		}, {
			key: 'open',
			value: function open() {
				this.node.classList.add('open');
				this.setHeight(this.height);
			}
		}, {
			key: 'close',
			value: function close() {
				this.node.classList.remove('open');
				this.setHeight(0);
			}
		}, {
			key: 'toggle',
			value: function toggle() {
				if (this.isOpen()) {
					this.close();
				} else {
					this.open();
				}
			}
		}, {
			key: 'setHeight',
			value: function setHeight(h) {
				this.container.style.height = h + 'px';
			}
		}, {
			key: 'addController',
			value: function addController(controller) {
				this.controllers.push(controller);
				this.container.appendChild(controller.node);
				controller.parent = this;
				this.height += controller.height;
				if (this.isOpen()) {
					this.setHeight(this.height);
				}
			}
		}, {
			key: 'addControllers',
			value: function addControllers() {
				for (var _len = arguments.length, controllers = Array(_len), _key = 0; _key < _len; _key++) {
					controllers[_key] = arguments[_key];
				}
	
				controllers.forEach(this.addController.bind(this));
			}
		}, {
			key: 'removeController',
			value: function removeController(controller) {
				this.height -= controller.height;
				controller.destroy();
				this.setHeight(this.height);
				var i = this.controllers.indexOf(controller);
				delete this.controllers[i];
				// this.controllers.splice(i, 1);
			}
		}, {
			key: 'removeAllControllers',
			value: function removeAllControllers() {
				this.controllers.forEach(this.removeController.bind(this));
				this.controllers.length = 0;
			}
		}, {
			key: 'disable',
			value: function disable() {
				this.controllers.forEach(function (controller) {
					controller.disable();
				});
			}
		}]);
	
		return Bin;
	})();
	
	exports.Bin = Bin;
	
	var Controller = (function () {
		function Controller(type, title) {
			_classCallCheck(this, Controller);
	
			this.title = title;
			this.type = type;
			this.node = document.createElement('div');
			this.node.classList.add('bin-item', 'controller', type);
			this.parent = null;
			this.height = null;
			this.updater = null;
			this.enabled = false;
			// this.node.appendChild();
		}
	
		_createClass(Controller, [{
			key: 'setState',
			value: function setState(s) {
				this.enabled = s;
				if (this.enabled) {
					this.node.classList.remove('disabled');
				} else {
					this.node.classList.add('disabled');
				}
			}
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.value = val;
			}
		}, {
			key: 'listener',
			value: function listener(e) {
				this.setValue(e.target.value);
				// console.log(`Setting ${this.title}: ${this.value}`);
				// this.options.onchange(this.value);
			}
		}, {
			key: 'watch',
			value: function watch(getter) {
				this.getter = getter;
				this.setState(false);
				this.update();
				return this;
			}
		}, {
			key: 'update',
			value: function update() {
				this.updater = requestAnimationFrame(this.update.bind(this));
				this.setValue(this.getter());
			}
		}, {
			key: 'unwatch',
			value: function unwatch() {
				cancelAnimationFrame(this.updater);
				this.setState(true);
			}
		}, {
			key: 'rewatch',
			value: function rewatch() {
				this.setState(false);
				this.update();
			}
		}, {
			key: 'disable',
			value: function disable() {
				this.setState(false);
			}
		}, {
			key: 'enable',
			value: function enable() {
				this.setState(true);
			}
		}, {
			key: 'destroy',
			value: function destroy() {
				// TODO: ensure properly destruction
				this.node.parentNode.removeChild(this.node);
				this.unwatch();
				this.node = null;
				this.parent = null;
				this.getter = null;
			}
		}]);
	
		return Controller;
	})();
	
	var TextController = (function (_Controller) {
		_inherits(TextController, _Controller);
	
		function TextController(title, value, opts) {
			_classCallCheck(this, TextController);
	
			_get(Object.getPrototypeOf(TextController.prototype), 'constructor', this).call(this, 'text', title);
			this.value = value;
			this.height = 48;
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				size: Number.MAX_VALUE,
				onchange: function onchange(e) {}
			});
	
			var label = document.createElement('label');
	
			var name = document.createElement('span');
			name.classList.add('bin-item-name');
			name.innerText = title;
			label.appendChild(name);
	
			this.input = document.createElement('input');
			this.input.classList.add('bin-item-value');
			this.input.type = 'text';
			this.input.value = this.value;
			label.appendChild(this.input);
	
			this.node.appendChild(label);
	
			this.input.addEventListener('change', this.listener.bind(this));
		}
	
		_createClass(TextController, [{
			key: 'setState',
			value: function setState(s) {
				this.enabled = s;
				this.input.disabled = !s;
				if (this.enabled) {
					this.node.classList.remove('disabled');
				} else {
					this.node.classList.add('disabled');
				}
			}
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.value = val;
				this.input.value = this.value;
			}
		}, {
			key: 'listener',
			value: function listener(e) {
				this.value = e.target.value;
				// console.log(`Setting ${this.title}: ${this.value}`);
				this.options.onchange(this.value);
			}
		}]);
	
		return TextController;
	})(Controller);
	
	exports.TextController = TextController;
	
	var NumberController = (function (_Controller2) {
		_inherits(NumberController, _Controller2);
	
		function NumberController(title, value, opts) {
			_classCallCheck(this, NumberController);
	
			_get(Object.getPrototypeOf(NumberController.prototype), 'constructor', this).call(this, 'number', title);
			this.value = value;
			this.height = 48;
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				min: null,
				max: null,
				step: null,
				decimals: 3,
				onchange: function onchange(val) {}
			});
	
			var label = document.createElement('label');
	
			var name = document.createElement('span');
			name.classList.add('bin-item-name');
			name.innerText = title;
			label.appendChild(name);
	
			this.input = document.createElement('input');
			this.input.classList.add('bin-item-value');
			this.input.type = 'number';
			this.input.value = this.value;
			if (this.options.min !== null) this.input.min = this.options.min;
			if (this.options.max !== null) this.input.max = this.options.max;
			if (this.options.step !== null) this.input.step = this.options.step;
			label.appendChild(this.input);
	
			this.node.appendChild(label);
	
			this.input.addEventListener('change', this.listener.bind(this));
		}
	
		_createClass(NumberController, [{
			key: 'setValue',
			value: function setValue(val) {
				this.value = val;
				this.input.value = this.value.toFixed(this.options.decimals);
			}
		}, {
			key: 'setState',
			value: function setState(s) {
				this.enabled = s;
				this.input.disabled = !s;
				if (this.enabled) {
					this.node.classList.remove('disabled');
				} else {
					this.node.classList.add('disabled');
				}
			}
		}, {
			key: 'listener',
			value: function listener(e) {
				this.value = e.target.value;
				// console.log(`Setting ${this.title}: ${this.value}`);
				this.options.onchange(parseFloat(this.value));
			}
		}]);
	
		return NumberController;
	})(Controller);
	
	exports.NumberController = NumberController;
	
	var ToggleController = (function (_Controller3) {
		_inherits(ToggleController, _Controller3);
	
		function ToggleController(title, value, opts) {
			_classCallCheck(this, ToggleController);
	
			_get(Object.getPrototypeOf(ToggleController.prototype), 'constructor', this).call(this, 'toggle', title);
			this.value = value;
			this.height = 48;
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				onchange: function onchange() {}
			});
	
			var label = document.createElement('label');
	
			var name = document.createElement('span');
			name.classList.add('bin-item-name');
			name.innerText = title;
			label.appendChild(name);
	
			this.input = document.createElement('input');
			this.input.classList.add('bin-item-value', 'icon');
			this.input.type = 'checkbox';
			this.input.checked = this.value;
			label.appendChild(this.input);
	
			this.node.appendChild(label);
	
			this.input.addEventListener('change', this.listener.bind(this));
		}
	
		_createClass(ToggleController, [{
			key: 'setValue',
			value: function setValue(val) {
				this.value = val;
				this.input.value = this.value;
			}
		}, {
			key: 'setState',
			value: function setState(s) {
				this.enabled = s;
				this.input.disabled = !s;
				if (this.enabled) {
					this.node.classList.remove('disabled');
				} else {
					this.node.classList.add('disabled');
				}
			}
		}, {
			key: 'listener',
			value: function listener(e) {
				this.value = e.target.checked;
				// console.log(`Toggling ${this.title}: ${this.value ? 'on' : 'off'}`);
				this.options.onchange(this.value);
			}
		}]);
	
		return ToggleController;
	})(Controller);
	
	exports.ToggleController = ToggleController;
	
	var ActionController = (function (_Controller4) {
		_inherits(ActionController, _Controller4);
	
		function ActionController(title, opts) {
			_classCallCheck(this, ActionController);
	
			_get(Object.getPrototypeOf(ActionController.prototype), 'constructor', this).call(this, 'action', title);
			this.height = 48;
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				action: function action(e) {}
			});
	
			var label = document.createElement('label');
	
			var name = document.createElement('span');
			name.classList.add('bin-item-name');
			name.innerText = title;
			label.appendChild(name);
	
			this.input = document.createElement('button');
			this.input.classList.add('bin-item-value', 'icon');
			// this.input.type = 'button';
			label.appendChild(this.input);
	
			this.node.appendChild(label);
	
			this.input.addEventListener('click', this.listener.bind(this));
		}
	
		_createClass(ActionController, [{
			key: 'setValue',
			value: function setValue(val) {
				this.value = val;
				this.input.value = this.value;
			}
		}, {
			key: 'setState',
			value: function setState(s) {
				this.enabled = s;
				this.input.disabled = !s;
				if (this.enabled) {
					this.node.classList.remove('disabled');
				} else {
					this.node.classList.add('disabled');
				}
			}
		}, {
			key: 'listener',
			value: function listener(e) {
				// console.log(`Running ${this.title}`);
				this.options.action(e);
			}
		}]);
	
		return ActionController;
	})(Controller);
	
	exports.ActionController = ActionController;
	
	var DropdownController = (function (_Controller5) {
		_inherits(DropdownController, _Controller5);
	
		function DropdownController(title, items, opts) {
			_classCallCheck(this, DropdownController);
	
			_get(Object.getPrototypeOf(DropdownController.prototype), 'constructor', this).call(this, 'dropdown', title);
			// this.value = value;
			this.height = 48;
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				onselect: function onselect() {}
			});
	
			var label = document.createElement('label');
	
			var name = document.createElement('span');
			name.classList.add('bin-item-name');
			name.innerText = title;
			label.appendChild(name);
	
			this.input = document.createElement('select');
			this.input.classList.add('bin-item-value');
			this.createItems(items);
			label.appendChild(this.input);
	
			this.node.appendChild(label);
	
			this.input.addEventListener('change', this.listener.bind(this));
		}
	
		_createClass(DropdownController, [{
			key: 'createItems',
			value: function createItems(list) {
				var _this2 = this;
	
				this.items = list;
				this.items.forEach(function (item) {
					var itemNode = document.createElement('option');
					itemNode.value = item.value;
					itemNode.innerText = item.hasOwnProperty('name') ? item.name : item.value;
					if (item.selected) {
						itemNode.selected = true;
						// this.value = item.value;
					}
					if (item.disabled) {
						itemNode.disabled = true;
					}
					_this2.input.appendChild(itemNode);
				});
			}
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.value = val;
				this.input.value = this.value;
			}
		}, {
			key: 'setState',
			value: function setState(s) {
				this.enabled = s;
				this.input.disabled = !s;
				if (this.enabled) {
					this.node.classList.remove('disabled');
				} else {
					this.node.classList.add('disabled');
				}
			}
		}, {
			key: 'listener',
			value: function listener(e) {
				this.value = this.input.value;
				// console.log(`Setting ${this.title}: ${this.value}`);
				this.options.onselect(this.value);
			}
		}]);
	
		return DropdownController;
	})(Controller);
	
	exports.DropdownController = DropdownController;
	
	var HTMLController = (function (_Controller6) {
		_inherits(HTMLController, _Controller6);
	
		function HTMLController(title, opts) {
			_classCallCheck(this, HTMLController);
	
			_get(Object.getPrototypeOf(HTMLController.prototype), 'constructor', this).call(this, 'html', title);
			this.height = 160;
		}
	
		_createClass(HTMLController, [{
			key: 'getHTML',
			value: function getHTML() {
				return this.node.innerHTML;
			}
		}, {
			key: 'setHTML',
			value: function setHTML(content) {
				this.node.innerHTML = content;
			}
	
			// append(text) {}
		}]);
	
		return HTMLController;
	})(Controller);
	
	exports.HTMLController = HTMLController;
	
	var GridController = (function (_Controller7) {
		_inherits(GridController, _Controller7);
	
		function GridController(title, items, opts) {
			_classCallCheck(this, GridController);
	
			_get(Object.getPrototypeOf(GridController.prototype), 'constructor', this).call(this, 'grid', title);
			this.height = 0;
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				size: 'medium',
				type: 'select'
			});
	
			this.node = document.createDocumentFragment();
			this.createItems(items);
			this.selectedIndex = 0;
			this.multiSelection = [];
		}
	
		_createClass(GridController, [{
			key: 'createItems',
			value: function createItems(list) {
				var _this3 = this;
	
				this.height = 48 * Math.ceil(list.length / Math.floor(256 / 48));
	
				var i = 0;
				this.items = list;
				this.items.forEach(function (item) {
					item.node = document.createElement('div');
					item.node.classList.add('bin-item');
					item.node.dataset.index = i++;
					item.node.title = item.tooltip;
					if (item.selected) {
						item.node.classList.add('selected');
					}
					if (item.disabled) {
						item.node.classList.add('disabled');
					}
					if (_this3.options.type === 'toggle' || item.type === 'toggle') {
						item.alt = false;
					}
					item.node.addEventListener('click', function (e) {
						_this3.listener(e);
					});
					// item.node.addEventListener('click', item.onclick);
					item.iconNode = document.createElement('i');
					if (item.hasOwnProperty('icon') && item.icon.length > 0) {
						item.iconNode.classList.add(item.icon);
					} else if (item.hasOwnProperty('shortcut') && item.shortcut.length > 0) {
						item.iconNode.innerText = item.shortcut.toUpperCase().charAt(0);
					}
					item.node.appendChild(item.iconNode);
					_this3.node.appendChild(item.node);
				});
			}
		}, {
			key: 'listener',
			value: function listener(e) {
				var el = e.target,
				    i = undefined,
				    type = undefined;
				while (el.parentElement !== null && typeof el.dataset.index === 'undefined') {
					el = el.parentElement;
				}
				if (typeof el.dataset.index !== 'undefined') {
					i = parseInt(el.dataset.index);
					type = this.options.type === 'mixed' ? this.items[i].type : this.options.type;
					// console.log(type);
					if (type === 'select') {
						this.select(i);
					} else if (type === 'toggle') {
						this.toggle(i);
					} else if (type === 'action') {
						if (!this.items[i].disabled) {
							this.items[i].action.call(this, el);
						}
					}
				}
			}
		}, {
			key: 'select',
			value: function select(i) {
				var children = Array.prototype.slice.call(this.parent.container.childNodes, 0);
				if (this.items[i].disabled) {
					return;
				}
	
				this.multiSelection.length = 0;
				// Deselect all
				this.selectedIndex = i;
				children.forEach(function (el) {
					el.classList.remove('selected');
				});
				// el = this.parent.container.querySelector(`.bin-item[data-index=${i}]`);
				children[i].classList.add('selected');
				this.items[i].onselect(children[i]);
			}
		}, {
			key: 'toggle',
			value: function toggle(i) {
				var item = this.items[i];
				if (item.disabled) {
					return;
				}
	
				item.alt = !item.alt;
				item.node.classList.toggle('alt');
				// console.log(item);
				item.node.title = item.alt ? item.tooltip_alt : item.tooltip;
				item.iconNode.className = item.alt ? item.icon_alt : item.icon;
				item.onchange(item.node);
			}
		}, {
			key: 'multiSelect',
			value: function multiSelect(i) {}
		}, {
			key: 'disable',
			value: function disable() {
				this.items.forEach(function (item) {
					item.disabled = true;
					item.node.classList.add('disabled');
				});
			}
		}]);
	
		return GridController;
	})(Controller);
	
	exports.GridController = GridController;
	
	var CanvasController = (function (_Controller8) {
		_inherits(CanvasController, _Controller8);
	
		function CanvasController(opts) {
			_classCallCheck(this, CanvasController);
	
			_get(Object.getPrototypeOf(CanvasController.prototype), 'constructor', this).call(this, 'canvas', 'canvas');
			this.height = 160;
			this.node = document.createElement('canvas');
			this.ctx = this.node.getContext('2d');
			this.node.height = this.height;
			this.node.width = 256;
		}
	
		return CanvasController;
	})(Controller);
	
	exports.CanvasController = CanvasController;
	
	var InfoController = (function (_Controller9) {
		_inherits(InfoController, _Controller9);
	
		function InfoController(title, getter, opts) {
			_classCallCheck(this, InfoController);
	
			_get(Object.getPrototypeOf(InfoController.prototype), 'constructor', this).call(this, 'info', title);
			this.height = 48;
			this.getter = getter;
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				interval: 100,
				decimals: 2,
				format: 'auto'
			});
	
			var label = document.createElement('label');
	
			var name = document.createElement('span');
			name.classList.add('bin-item-name');
			name.innerText = title;
			label.appendChild(name);
	
			this.input = document.createElement('input');
			this.input.classList.add('bin-item-value');
			this.input.type = 'text';
			this.input.value = getter();
			this.input.disabled = true;
			label.appendChild(this.input);
	
			this.node.appendChild(label);
	
			this.watch();
		}
	
		_createClass(InfoController, [{
			key: 'watch',
			value: function watch() {
				setTimeout(this.watch.bind(this), this.options.interval);
				this.setInfo(this.getter());
			}
		}, {
			key: 'setInfo',
			value: function setInfo(value) {
				var infoString = undefined,
				    vx = undefined,
				    vy = undefined;
	
				switch (this.options.format) {
					case 'text':
						infoString = value;break;
					case 'boolean':
						infoString = value ? 'True' : 'False';break;
					case 'number':
						infoString = value.toFixed(this.options.decimals);break;
					case 'vector':
						vx = value.x.toFixed(this.options.decimals);
						vy = value.y.toFixed(this.options.decimals);
						infoString = '(' + vx + ', ' + vy + ')';
						break;
					default:
						infoString = value.toString();
				}
				this.input.value = infoString;
			}
		}]);
	
		return InfoController;
	})(Controller);
	
	exports.InfoController = InfoController;
	
	var ColorController = (function (_Controller10) {
		_inherits(ColorController, _Controller10);
	
		function ColorController(title, value, opts) {
			_classCallCheck(this, ColorController);
	
			_get(Object.getPrototypeOf(ColorController.prototype), 'constructor', this).call(this, 'color', title);
			// this.value = value;
			this.height = 48;
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				onchange: function onchange() {}
			});
	
			var label = document.createElement('label');
	
			var name = document.createElement('span');
			name.classList.add('bin-item-name');
			name.innerText = title;
			label.appendChild(name);
	
			this.input = document.createElement('input');
			this.input.type = 'color';
			this.input.classList.add('bin-item-value');
			label.appendChild(this.input);
	
			this.node.appendChild(label);
	
			this.input.addEventListener('change', this.listener.bind(this));
		}
	
		_createClass(ColorController, [{
			key: 'setState',
			value: function setState(s) {
				this.enabled = s;
				this.input.disabled = !s;
				if (this.enabled) {
					this.node.classList.remove('disabled');
				} else {
					this.node.classList.add('disabled');
				}
			}
		}, {
			key: 'setValue',
			value: function setValue(val) {
				this.value = val;
				this.input.value = this.value;
			}
		}, {
			key: 'listener',
			value: function listener(e) {
				this.value = this.input.value;
				// console.log(`Setting ${this.title}: ${this.value}`);
				this.options.onchange(this.value);
			}
		}]);
	
		return ColorController;
	})(Controller);
	
	exports.ColorController = ColorController;
	
	var Pane = (function () {
		function Pane(container, opts) {
			_classCallCheck(this, Pane);
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {});
			this.bins = [];
			this.width = 256;
			this.node = document.createElement('div');
			this.node.classList.add('gui-pane');
	
			container.appendChild(this.node);
		}
	
		_createClass(Pane, [{
			key: 'addBin',
			value: function addBin(bin) {
				this.bins.push(bin);
				this.node.appendChild(bin.node);
			}
		}, {
			key: 'disableAll',
			value: function disableAll() {
				this.bins.forEach(function (bin) {
					bin.disable();
				});
			}
		}]);
	
		return Pane;
	})();

	exports.Pane = Pane;

/***/ },
/* 6 */
/*!*****************************!*\
  !*** ./~/defaults/index.js ***!
  \*****************************/
/***/ function(module, exports, __webpack_require__) {

	var clone = __webpack_require__(/*! clone */ 7);
	
	module.exports = function(options, defaults) {
	  options = options || {};
	
	  Object.keys(defaults).forEach(function(key) {
	    if (typeof options[key] === 'undefined') {
	      options[key] = clone(defaults[key]);
	    }
	  });
	
	  return options;
	};

/***/ },
/* 7 */
/*!*************************************!*\
  !*** ./~/defaults/~/clone/clone.js ***!
  \*************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	// shim for Node's 'util' package
	// DO NOT REMOVE THIS! It is required for compatibility with EnderJS (http://enderjs.com/).
	var util = {
	  isArray: function (ar) {
	    return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
	  },
	  isDate: function (d) {
	    return typeof d === 'object' && objectToString(d) === '[object Date]';
	  },
	  isRegExp: function (re) {
	    return typeof re === 'object' && objectToString(re) === '[object RegExp]';
	  },
	  getRegExpFlags: function (re) {
	    var flags = '';
	    re.global && (flags += 'g');
	    re.ignoreCase && (flags += 'i');
	    re.multiline && (flags += 'm');
	    return flags;
	  }
	};
	
	
	if (true)
	  module.exports = clone;
	
	/**
	 * Clones (copies) an Object using deep copying.
	 *
	 * This function supports circular references by default, but if you are certain
	 * there are no circular references in your object, you can save some CPU time
	 * by calling clone(obj, false).
	 *
	 * Caution: if `circular` is false and `parent` contains circular references,
	 * your program may enter an infinite loop and crash.
	 *
	 * @param `parent` - the object to be cloned
	 * @param `circular` - set to true if the object to be cloned may contain
	 *    circular references. (optional - true by default)
	 * @param `depth` - set to a number if the object is only to be cloned to
	 *    a particular depth. (optional - defaults to Infinity)
	 * @param `prototype` - sets the prototype to be used when cloning an object.
	 *    (optional - defaults to parent prototype).
	*/
	
	function clone(parent, circular, depth, prototype) {
	  // maintain two arrays for circular references, where corresponding parents
	  // and children have the same index
	  var allParents = [];
	  var allChildren = [];
	
	  var useBuffer = typeof Buffer != 'undefined';
	
	  if (typeof circular == 'undefined')
	    circular = true;
	
	  if (typeof depth == 'undefined')
	    depth = Infinity;
	
	  // recurse this function so we don't reset allParents and allChildren
	  function _clone(parent, depth) {
	    // cloning null always returns null
	    if (parent === null)
	      return null;
	
	    if (depth == 0)
	      return parent;
	
	    var child;
	    var proto;
	    if (typeof parent != 'object') {
	      return parent;
	    }
	
	    if (util.isArray(parent)) {
	      child = [];
	    } else if (util.isRegExp(parent)) {
	      child = new RegExp(parent.source, util.getRegExpFlags(parent));
	      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
	    } else if (util.isDate(parent)) {
	      child = new Date(parent.getTime());
	    } else if (useBuffer && Buffer.isBuffer(parent)) {
	      child = new Buffer(parent.length);
	      parent.copy(child);
	      return child;
	    } else {
	      if (typeof prototype == 'undefined') {
	        proto = Object.getPrototypeOf(parent);
	        child = Object.create(proto);
	      }
	      else {
	        child = Object.create(prototype);
	        proto = prototype;
	      }
	    }
	
	    if (circular) {
	      var index = allParents.indexOf(parent);
	
	      if (index != -1) {
	        return allChildren[index];
	      }
	      allParents.push(parent);
	      allChildren.push(child);
	    }
	
	    for (var i in parent) {
	      var attrs;
	      if (proto) {
	        attrs = Object.getOwnPropertyDescriptor(proto, i);
	      }
	      
	      if (attrs && attrs.set == null) {
	        continue;
	      }
	      child[i] = _clone(parent[i], depth - 1);
	    }
	
	    return child;
	  }
	
	  return _clone(parent, depth);
	}
	
	/**
	 * Simple flat clone using prototype, accepts only objects, usefull for property
	 * override on FLAT configuration object (no nested props).
	 *
	 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
	 * works.
	 */
	clone.clonePrototype = function(parent) {
	  if (parent === null)
	    return null;
	
	  var c = function () {};
	  c.prototype = parent;
	  return new c();
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/~/node-libs-browser/~/buffer/index.js */ 8).Buffer))

/***/ },
/* 8 */
/*!*******************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/buffer/index.js ***!
  \*******************************************************/
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * @license  MIT
	 */
	
	var base64 = __webpack_require__(/*! base64-js */ 9)
	var ieee754 = __webpack_require__(/*! ieee754 */ 10)
	var isArray = __webpack_require__(/*! is-array */ 11)
	
	exports.Buffer = Buffer
	exports.SlowBuffer = SlowBuffer
	exports.INSPECT_MAX_BYTES = 50
	Buffer.poolSize = 8192 // not used by this implementation
	
	var rootParent = {}
	
	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
	 *     on objects.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.
	
	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = (function () {
	  function Bar () {}
	  try {
	    var arr = new Uint8Array(1)
	    arr.foo = function () { return 42 }
	    arr.constructor = Bar
	    return arr.foo() === 42 && // typed array instances can be augmented
	        arr.constructor === Bar && // constructor can be set
	        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
	        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
	  } catch (e) {
	    return false
	  }
	})()
	
	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}
	
	/**
	 * Class: Buffer
	 * =============
	 *
	 * The Buffer constructor returns instances of `Uint8Array` that are augmented
	 * with function properties for all the node `Buffer` API functions. We use
	 * `Uint8Array` so that square bracket notation works as expected -- it returns
	 * a single octet.
	 *
	 * By augmenting the instances, we can avoid modifying the `Uint8Array`
	 * prototype.
	 */
	function Buffer (arg) {
	  if (!(this instanceof Buffer)) {
	    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
	    if (arguments.length > 1) return new Buffer(arg, arguments[1])
	    return new Buffer(arg)
	  }
	
	  this.length = 0
	  this.parent = undefined
	
	  // Common case.
	  if (typeof arg === 'number') {
	    return fromNumber(this, arg)
	  }
	
	  // Slightly less common case.
	  if (typeof arg === 'string') {
	    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
	  }
	
	  // Unusual.
	  return fromObject(this, arg)
	}
	
	function fromNumber (that, length) {
	  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < length; i++) {
	      that[i] = 0
	    }
	  }
	  return that
	}
	
	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'
	
	  // Assumption: byteLength() return value is always < kMaxLength.
	  var length = byteLength(string, encoding) | 0
	  that = allocate(that, length)
	
	  that.write(string, encoding)
	  return that
	}
	
	function fromObject (that, object) {
	  if (Buffer.isBuffer(object)) return fromBuffer(that, object)
	
	  if (isArray(object)) return fromArray(that, object)
	
	  if (object == null) {
	    throw new TypeError('must start with number, buffer, array or string')
	  }
	
	  if (typeof ArrayBuffer !== 'undefined') {
	    if (object.buffer instanceof ArrayBuffer) {
	      return fromTypedArray(that, object)
	    }
	    if (object instanceof ArrayBuffer) {
	      return fromArrayBuffer(that, object)
	    }
	  }
	
	  if (object.length) return fromArrayLike(that, object)
	
	  return fromJsonObject(that, object)
	}
	
	function fromBuffer (that, buffer) {
	  var length = checked(buffer.length) | 0
	  that = allocate(that, length)
	  buffer.copy(that, 0, 0, length)
	  return that
	}
	
	function fromArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Duplicate of fromArray() to keep fromArray() monomorphic.
	function fromTypedArray (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  // Truncating the elements is probably not what people expect from typed
	  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
	  // of the old Buffer constructor.
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function fromArrayBuffer (that, array) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    array.byteLength
	    that = Buffer._augment(new Uint8Array(array))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromTypedArray(that, new Uint8Array(array))
	  }
	  return that
	}
	
	function fromArrayLike (that, array) {
	  var length = checked(array.length) | 0
	  that = allocate(that, length)
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
	// Returns a zero-length buffer for inputs that don't conform to the spec.
	function fromJsonObject (that, object) {
	  var array
	  var length = 0
	
	  if (object.type === 'Buffer' && isArray(object.data)) {
	    array = object.data
	    length = checked(array.length) | 0
	  }
	  that = allocate(that, length)
	
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255
	  }
	  return that
	}
	
	function allocate (that, length) {
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = Buffer._augment(new Uint8Array(length))
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that.length = length
	    that._isBuffer = true
	  }
	
	  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
	  if (fromPool) that.parent = rootParent
	
	  return that
	}
	
	function checked (length) {
	  // Note: cannot use `length < kMaxLength` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	
	function SlowBuffer (subject, encoding) {
	  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)
	
	  var buf = new Buffer(subject, encoding)
	  delete buf.parent
	  return buf
	}
	
	Buffer.isBuffer = function isBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}
	
	Buffer.compare = function compare (a, b) {
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }
	
	  if (a === b) return 0
	
	  var x = a.length
	  var y = b.length
	
	  var i = 0
	  var len = Math.min(x, y)
	  while (i < len) {
	    if (a[i] !== b[i]) break
	
	    ++i
	  }
	
	  if (i !== len) {
	    x = a[i]
	    y = b[i]
	  }
	
	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	}
	
	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'binary':
	    case 'base64':
	    case 'raw':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	}
	
	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')
	
	  if (list.length === 0) {
	    return new Buffer(0)
	  }
	
	  var i
	  if (length === undefined) {
	    length = 0
	    for (i = 0; i < list.length; i++) {
	      length += list[i].length
	    }
	  }
	
	  var buf = new Buffer(length)
	  var pos = 0
	  for (i = 0; i < list.length; i++) {
	    var item = list[i]
	    item.copy(buf, pos)
	    pos += item.length
	  }
	  return buf
	}
	
	function byteLength (string, encoding) {
	  if (typeof string !== 'string') string = '' + string
	
	  var len = string.length
	  if (len === 0) return 0
	
	  // Use a for loop to avoid recursion
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'binary':
	      // Deprecated
	      case 'raw':
	      case 'raws':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	Buffer.byteLength = byteLength
	
	// pre-set for values that may exist in the future
	Buffer.prototype.length = undefined
	Buffer.prototype.parent = undefined
	
	function slowToString (encoding, start, end) {
	  var loweredCase = false
	
	  start = start | 0
	  end = end === undefined || end === Infinity ? this.length : end | 0
	
	  if (!encoding) encoding = 'utf8'
	  if (start < 0) start = 0
	  if (end > this.length) end = this.length
	  if (end <= start) return ''
	
	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)
	
	      case 'ascii':
	        return asciiSlice(this, start, end)
	
	      case 'binary':
	        return binarySlice(this, start, end)
	
	      case 'base64':
	        return base64Slice(this, start, end)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	}
	
	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	}
	
	Buffer.prototype.inspect = function inspect () {
	  var str = ''
	  var max = exports.INSPECT_MAX_BYTES
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
	    if (this.length > max) str += ' ... '
	  }
	  return '<Buffer ' + str + '>'
	}
	
	Buffer.prototype.compare = function compare (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return 0
	  return Buffer.compare(this, b)
	}
	
	Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
	  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
	  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
	  byteOffset >>= 0
	
	  if (this.length === 0) return -1
	  if (byteOffset >= this.length) return -1
	
	  // Negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)
	
	  if (typeof val === 'string') {
	    if (val.length === 0) return -1 // special case: looking for empty string always fails
	    return String.prototype.indexOf.call(this, val, byteOffset)
	  }
	  if (Buffer.isBuffer(val)) {
	    return arrayIndexOf(this, val, byteOffset)
	  }
	  if (typeof val === 'number') {
	    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
	      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
	    }
	    return arrayIndexOf(this, [ val ], byteOffset)
	  }
	
	  function arrayIndexOf (arr, val, byteOffset) {
	    var foundIndex = -1
	    for (var i = 0; byteOffset + i < arr.length; i++) {
	      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
	        if (foundIndex === -1) foundIndex = i
	        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
	      } else {
	        foundIndex = -1
	      }
	    }
	    return -1
	  }
	
	  throw new TypeError('val must be string, number or Buffer')
	}
	
	// `get` is deprecated
	Buffer.prototype.get = function get (offset) {
	  console.log('.get() is deprecated. Access using array indexes instead.')
	  return this.readUInt8(offset)
	}
	
	// `set` is deprecated
	Buffer.prototype.set = function set (v, offset) {
	  console.log('.set() is deprecated. Access using array indexes instead.')
	  return this.writeUInt8(v, offset)
	}
	
	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0
	  var remaining = buf.length - offset
	  if (!length) {
	    length = remaining
	  } else {
	    length = Number(length)
	    if (length > remaining) {
	      length = remaining
	    }
	  }
	
	  // must be an even number of digits
	  var strLen = string.length
	  if (strLen % 2 !== 0) throw new Error('Invalid hex string')
	
	  if (length > strLen / 2) {
	    length = strLen / 2
	  }
	  for (var i = 0; i < length; i++) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16)
	    if (isNaN(parsed)) throw new Error('Invalid hex string')
	    buf[offset + i] = parsed
	  }
	  return i
	}
	
	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}
	
	function binaryWrite (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}
	
	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}
	
	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}
	
	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8'
	    length = this.length
	    offset = 0
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset
	    length = this.length
	    offset = 0
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0
	    if (isFinite(length)) {
	      length = length | 0
	      if (encoding === undefined) encoding = 'utf8'
	    } else {
	      encoding = length
	      length = undefined
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    var swap = encoding
	    encoding = offset
	    offset = length | 0
	    length = swap
	  }
	
	  var remaining = this.length - offset
	  if (length === undefined || length > remaining) length = remaining
	
	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('attempt to write outside buffer bounds')
	  }
	
	  if (!encoding) encoding = 'utf8'
	
	  var loweredCase = false
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)
	
	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)
	
	      case 'ascii':
	        return asciiWrite(this, string, offset, length)
	
	      case 'binary':
	        return binaryWrite(this, string, offset, length)
	
	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)
	
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)
	
	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase()
	        loweredCase = true
	    }
	  }
	}
	
	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	}
	
	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}
	
	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end)
	  var res = []
	
	  var i = start
	  while (i < end) {
	    var firstByte = buf[i]
	    var codePoint = null
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1
	
	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint
	
	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1]
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1]
	          thirdByte = buf[i + 2]
	          fourthByte = buf[i + 3]
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint
	            }
	          }
	      }
	    }
	
	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD
	      bytesPerSequence = 1
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
	      codePoint = 0xDC00 | codePoint & 0x3FF
	    }
	
	    res.push(codePoint)
	    i += bytesPerSequence
	  }
	
	  return decodeCodePointsArray(res)
	}
	
	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000
	
	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }
	
	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = ''
	  var i = 0
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    )
	  }
	  return res
	}
	
	function asciiSlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i] & 0x7F)
	  }
	  return ret
	}
	
	function binarySlice (buf, start, end) {
	  var ret = ''
	  end = Math.min(buf.length, end)
	
	  for (var i = start; i < end; i++) {
	    ret += String.fromCharCode(buf[i])
	  }
	  return ret
	}
	
	function hexSlice (buf, start, end) {
	  var len = buf.length
	
	  if (!start || start < 0) start = 0
	  if (!end || end < 0 || end > len) end = len
	
	  var out = ''
	  for (var i = start; i < end; i++) {
	    out += toHex(buf[i])
	  }
	  return out
	}
	
	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end)
	  var res = ''
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
	  }
	  return res
	}
	
	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length
	  start = ~~start
	  end = end === undefined ? len : ~~end
	
	  if (start < 0) {
	    start += len
	    if (start < 0) start = 0
	  } else if (start > len) {
	    start = len
	  }
	
	  if (end < 0) {
	    end += len
	    if (end < 0) end = 0
	  } else if (end > len) {
	    end = len
	  }
	
	  if (end < start) end = start
	
	  var newBuf
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = Buffer._augment(this.subarray(start, end))
	  } else {
	    var sliceLen = end - start
	    newBuf = new Buffer(sliceLen, undefined)
	    for (var i = 0; i < sliceLen; i++) {
	      newBuf[i] = this[i + start]
	    }
	  }
	
	  if (newBuf.length) newBuf.parent = this.parent || this
	
	  return newBuf
	}
	
	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}
	
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length)
	  }
	
	  var val = this[offset + --byteLength]
	  var mul = 1
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul
	  }
	
	  return val
	}
	
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  return this[offset]
	}
	
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return this[offset] | (this[offset + 1] << 8)
	}
	
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  return (this[offset] << 8) | this[offset + 1]
	}
	
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	}
	
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	}
	
	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var val = this[offset]
	  var mul = 1
	  var i = 0
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkOffset(offset, byteLength, this.length)
	
	  var i = byteLength
	  var mul = 1
	  var val = this[offset + --i]
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul
	  }
	  mul *= 0x80
	
	  if (val >= mul) val -= Math.pow(2, 8 * byteLength)
	
	  return val
	}
	
	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length)
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	}
	
	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset] | (this[offset + 1] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length)
	  var val = this[offset + 1] | (this[offset] << 8)
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	}
	
	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	}
	
	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	
	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	}
	
	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, true, 23, 4)
	}
	
	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length)
	  return ieee754.read(this, offset, false, 23, 4)
	}
	
	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, true, 52, 8)
	}
	
	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length)
	  return ieee754.read(this, offset, false, 52, 8)
	}
	
	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	}
	
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var mul = 1
	  var i = 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  byteLength = byteLength | 0
	  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)
	
	  var i = byteLength - 1
	  var mul = 1
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  this[offset] = value
	  return offset + 1
	}
	
	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8
	  }
	}
	
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
	  }
	}
	
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 1] = (value >>> 8)
	    this[offset] = value
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = 0
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset] = value & 0xFF
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1)
	
	    checkInt(this, value, offset, byteLength, limit - 1, -limit)
	  }
	
	  var i = byteLength - 1
	  var mul = 1
	  var sub = value < 0 ? 1 : 0
	  this[offset + i] = value & 0xFF
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
	  }
	
	  return offset + byteLength
	}
	
	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
	  if (value < 0) value = 0xff + value + 1
	  this[offset] = value
	  return offset + 1
	}
	
	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	  } else {
	    objectWriteUInt16(this, value, offset, true)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8)
	    this[offset + 1] = value
	  } else {
	    objectWriteUInt16(this, value, offset, false)
	  }
	  return offset + 2
	}
	
	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = value
	    this[offset + 1] = (value >>> 8)
	    this[offset + 2] = (value >>> 16)
	    this[offset + 3] = (value >>> 24)
	  } else {
	    objectWriteUInt32(this, value, offset, true)
	  }
	  return offset + 4
	}
	
	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value
	  offset = offset | 0
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
	  if (value < 0) value = 0xffffffff + value + 1
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24)
	    this[offset + 1] = (value >>> 16)
	    this[offset + 2] = (value >>> 8)
	    this[offset + 3] = value
	  } else {
	    objectWriteUInt32(this, value, offset, false)
	  }
	  return offset + 4
	}
	
	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (value > max || value < min) throw new RangeError('value is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('index out of range')
	  if (offset < 0) throw new RangeError('index out of range')
	}
	
	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 23, 4)
	  return offset + 4
	}
	
	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	}
	
	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
	  }
	  ieee754.write(buf, value, offset, littleEndian, 52, 8)
	  return offset + 8
	}
	
	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	}
	
	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	}
	
	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0
	  if (!end && end !== 0) end = this.length
	  if (targetStart >= target.length) targetStart = target.length
	  if (!targetStart) targetStart = 0
	  if (end > 0 && end < start) end = start
	
	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0
	
	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')
	
	  // Are we oob?
	  if (end > this.length) end = this.length
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start
	  }
	
	  var len = end - start
	  var i
	
	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; i--) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; i++) {
	      target[i + targetStart] = this[i + start]
	    }
	  } else {
	    target._set(this.subarray(start, start + len), targetStart)
	  }
	
	  return len
	}
	
	// fill(value, start=0, end=buffer.length)
	Buffer.prototype.fill = function fill (value, start, end) {
	  if (!value) value = 0
	  if (!start) start = 0
	  if (!end) end = this.length
	
	  if (end < start) throw new RangeError('end < start')
	
	  // Fill 0 bytes; we're done
	  if (end === start) return
	  if (this.length === 0) return
	
	  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
	  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')
	
	  var i
	  if (typeof value === 'number') {
	    for (i = start; i < end; i++) {
	      this[i] = value
	    }
	  } else {
	    var bytes = utf8ToBytes(value.toString())
	    var len = bytes.length
	    for (i = start; i < end; i++) {
	      this[i] = bytes[i % len]
	    }
	  }
	
	  return this
	}
	
	/**
	 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
	 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
	 */
	Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
	  if (typeof Uint8Array !== 'undefined') {
	    if (Buffer.TYPED_ARRAY_SUPPORT) {
	      return (new Buffer(this)).buffer
	    } else {
	      var buf = new Uint8Array(this.length)
	      for (var i = 0, len = buf.length; i < len; i += 1) {
	        buf[i] = this[i]
	      }
	      return buf.buffer
	    }
	  } else {
	    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
	  }
	}
	
	// HELPER FUNCTIONS
	// ================
	
	var BP = Buffer.prototype
	
	/**
	 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
	 */
	Buffer._augment = function _augment (arr) {
	  arr.constructor = Buffer
	  arr._isBuffer = true
	
	  // save reference to original Uint8Array set method before overwriting
	  arr._set = arr.set
	
	  // deprecated
	  arr.get = BP.get
	  arr.set = BP.set
	
	  arr.write = BP.write
	  arr.toString = BP.toString
	  arr.toLocaleString = BP.toString
	  arr.toJSON = BP.toJSON
	  arr.equals = BP.equals
	  arr.compare = BP.compare
	  arr.indexOf = BP.indexOf
	  arr.copy = BP.copy
	  arr.slice = BP.slice
	  arr.readUIntLE = BP.readUIntLE
	  arr.readUIntBE = BP.readUIntBE
	  arr.readUInt8 = BP.readUInt8
	  arr.readUInt16LE = BP.readUInt16LE
	  arr.readUInt16BE = BP.readUInt16BE
	  arr.readUInt32LE = BP.readUInt32LE
	  arr.readUInt32BE = BP.readUInt32BE
	  arr.readIntLE = BP.readIntLE
	  arr.readIntBE = BP.readIntBE
	  arr.readInt8 = BP.readInt8
	  arr.readInt16LE = BP.readInt16LE
	  arr.readInt16BE = BP.readInt16BE
	  arr.readInt32LE = BP.readInt32LE
	  arr.readInt32BE = BP.readInt32BE
	  arr.readFloatLE = BP.readFloatLE
	  arr.readFloatBE = BP.readFloatBE
	  arr.readDoubleLE = BP.readDoubleLE
	  arr.readDoubleBE = BP.readDoubleBE
	  arr.writeUInt8 = BP.writeUInt8
	  arr.writeUIntLE = BP.writeUIntLE
	  arr.writeUIntBE = BP.writeUIntBE
	  arr.writeUInt16LE = BP.writeUInt16LE
	  arr.writeUInt16BE = BP.writeUInt16BE
	  arr.writeUInt32LE = BP.writeUInt32LE
	  arr.writeUInt32BE = BP.writeUInt32BE
	  arr.writeIntLE = BP.writeIntLE
	  arr.writeIntBE = BP.writeIntBE
	  arr.writeInt8 = BP.writeInt8
	  arr.writeInt16LE = BP.writeInt16LE
	  arr.writeInt16BE = BP.writeInt16BE
	  arr.writeInt32LE = BP.writeInt32LE
	  arr.writeInt32BE = BP.writeInt32BE
	  arr.writeFloatLE = BP.writeFloatLE
	  arr.writeFloatBE = BP.writeFloatBE
	  arr.writeDoubleLE = BP.writeDoubleLE
	  arr.writeDoubleBE = BP.writeDoubleBE
	  arr.fill = BP.fill
	  arr.inspect = BP.inspect
	  arr.toArrayBuffer = BP.toArrayBuffer
	
	  return arr
	}
	
	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g
	
	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '='
	  }
	  return str
	}
	
	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}
	
	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}
	
	function utf8ToBytes (string, units) {
	  units = units || Infinity
	  var codePoint
	  var length = string.length
	  var leadSurrogate = null
	  var bytes = []
	
	  for (var i = 0; i < length; i++) {
	    codePoint = string.charCodeAt(i)
	
	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	          continue
	        }
	
	        // valid lead
	        leadSurrogate = codePoint
	
	        continue
	      }
	
	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	        leadSurrogate = codePoint
	        continue
	      }
	
	      // valid surrogate pair
	      codePoint = leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00 | 0x10000
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
	    }
	
	    leadSurrogate = null
	
	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint)
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      )
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }
	
	  return bytes
	}
	
	function asciiToBytes (str) {
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF)
	  }
	  return byteArray
	}
	
	function utf16leToBytes (str, units) {
	  var c, hi, lo
	  var byteArray = []
	  for (var i = 0; i < str.length; i++) {
	    if ((units -= 2) < 0) break
	
	    c = str.charCodeAt(i)
	    hi = c >> 8
	    lo = c % 256
	    byteArray.push(lo)
	    byteArray.push(hi)
	  }
	
	  return byteArray
	}
	
	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}
	
	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; i++) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i]
	  }
	  return i
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! (webpack)/~/node-libs-browser/~/buffer/index.js */ 8).Buffer))

/***/ },
/* 9 */
/*!*********************************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/buffer/~/base64-js/lib/b64.js ***!
  \*********************************************************************/
/***/ function(module, exports, __webpack_require__) {

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	
	;(function (exports) {
		'use strict';
	
	  var Arr = (typeof Uint8Array !== 'undefined')
	    ? Uint8Array
	    : Array
	
		var PLUS   = '+'.charCodeAt(0)
		var SLASH  = '/'.charCodeAt(0)
		var NUMBER = '0'.charCodeAt(0)
		var LOWER  = 'a'.charCodeAt(0)
		var UPPER  = 'A'.charCodeAt(0)
		var PLUS_URL_SAFE = '-'.charCodeAt(0)
		var SLASH_URL_SAFE = '_'.charCodeAt(0)
	
		function decode (elt) {
			var code = elt.charCodeAt(0)
			if (code === PLUS ||
			    code === PLUS_URL_SAFE)
				return 62 // '+'
			if (code === SLASH ||
			    code === SLASH_URL_SAFE)
				return 63 // '/'
			if (code < NUMBER)
				return -1 //no match
			if (code < NUMBER + 10)
				return code - NUMBER + 26 + 26
			if (code < UPPER + 26)
				return code - UPPER
			if (code < LOWER + 26)
				return code - LOWER + 26
		}
	
		function b64ToByteArray (b64) {
			var i, j, l, tmp, placeHolders, arr
	
			if (b64.length % 4 > 0) {
				throw new Error('Invalid string. Length must be a multiple of 4')
			}
	
			// the number of equal signs (place holders)
			// if there are two placeholders, than the two characters before it
			// represent one byte
			// if there is only one, then the three characters before it represent 2 bytes
			// this is just a cheap hack to not do indexOf twice
			var len = b64.length
			placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
	
			// base64 is 4/3 + up to two characters of the original data
			arr = new Arr(b64.length * 3 / 4 - placeHolders)
	
			// if there are placeholders, only get up to the last complete 4 chars
			l = placeHolders > 0 ? b64.length - 4 : b64.length
	
			var L = 0
	
			function push (v) {
				arr[L++] = v
			}
	
			for (i = 0, j = 0; i < l; i += 4, j += 3) {
				tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
				push((tmp & 0xFF0000) >> 16)
				push((tmp & 0xFF00) >> 8)
				push(tmp & 0xFF)
			}
	
			if (placeHolders === 2) {
				tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
				push(tmp & 0xFF)
			} else if (placeHolders === 1) {
				tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
				push((tmp >> 8) & 0xFF)
				push(tmp & 0xFF)
			}
	
			return arr
		}
	
		function uint8ToBase64 (uint8) {
			var i,
				extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
				output = "",
				temp, length
	
			function encode (num) {
				return lookup.charAt(num)
			}
	
			function tripletToBase64 (num) {
				return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
			}
	
			// go through the array every three bytes, we'll deal with trailing stuff later
			for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
				temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
				output += tripletToBase64(temp)
			}
	
			// pad the end with zeros, but make sure to not forget the extra bytes
			switch (extraBytes) {
				case 1:
					temp = uint8[uint8.length - 1]
					output += encode(temp >> 2)
					output += encode((temp << 4) & 0x3F)
					output += '=='
					break
				case 2:
					temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
					output += encode(temp >> 10)
					output += encode((temp >> 4) & 0x3F)
					output += encode((temp << 2) & 0x3F)
					output += '='
					break
			}
	
			return output
		}
	
		exports.toByteArray = b64ToByteArray
		exports.fromByteArray = uint8ToBase64
	}( false ? (this.base64js = {}) : exports))


/***/ },
/* 10 */
/*!*****************************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/buffer/~/ieee754/index.js ***!
  \*****************************************************************/
/***/ function(module, exports) {

	exports.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var nBits = -7
	  var i = isLE ? (nBytes - 1) : 0
	  var d = isLE ? -1 : 1
	  var s = buffer[offset + i]
	
	  i += d
	
	  e = s & ((1 << (-nBits)) - 1)
	  s >>= (-nBits)
	  nBits += eLen
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  m = e & ((1 << (-nBits)) - 1)
	  e >>= (-nBits)
	  nBits += mLen
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}
	
	  if (e === 0) {
	    e = 1 - eBias
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen)
	    e = e - eBias
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}
	
	exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c
	  var eLen = nBytes * 8 - mLen - 1
	  var eMax = (1 << eLen) - 1
	  var eBias = eMax >> 1
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
	  var i = isLE ? 0 : (nBytes - 1)
	  var d = isLE ? 1 : -1
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0
	
	  value = Math.abs(value)
	
	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0
	    e = eMax
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2)
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--
	      c *= 2
	    }
	    if (e + eBias >= 1) {
	      value += rt / c
	    } else {
	      value += rt * Math.pow(2, 1 - eBias)
	    }
	    if (value * c >= 2) {
	      e++
	      c /= 2
	    }
	
	    if (e + eBias >= eMax) {
	      m = 0
	      e = eMax
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen)
	      e = e + eBias
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
	      e = 0
	    }
	  }
	
	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}
	
	  e = (e << mLen) | m
	  eLen += mLen
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}
	
	  buffer[offset + i - d] |= s * 128
	}


/***/ },
/* 11 */
/*!******************************************************************!*\
  !*** (webpack)/~/node-libs-browser/~/buffer/~/is-array/index.js ***!
  \******************************************************************/
/***/ function(module, exports) {

	
	/**
	 * isArray
	 */
	
	var isArray = Array.isArray;
	
	/**
	 * toString
	 */
	
	var str = Object.prototype.toString;
	
	/**
	 * Whether or not the given `val`
	 * is an array.
	 *
	 * example:
	 *
	 *        isArray([]);
	 *        // > true
	 *        isArray(arguments);
	 *        // > false
	 *        isArray('');
	 *        // > false
	 *
	 * @param {mixed} val
	 * @return {bool}
	 */
	
	module.exports = isArray || function (val) {
	  return !! val && '[object Array]' == str.call(val);
	};


/***/ },
/* 12 */
/*!********************************!*\
  !*** ./assets/styles/gui.less ***!
  \********************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/*!***************************!*\
  !*** ./src/playground.js ***!
  \***************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _simulatorJs = __webpack_require__(/*! ./simulator.js */ 19);
	
	var _simulatorJs2 = _interopRequireDefault(_simulatorJs);
	
	var _guiJs = __webpack_require__(/*! ./gui.js */ 5);
	
	var Gui = _interopRequireWildcard(_guiJs);
	
	var _clockJs = __webpack_require__(/*! ./clock.js */ 23);
	
	var _clockJs2 = _interopRequireDefault(_clockJs);
	
	var _entityJs = __webpack_require__(/*! ./entity.js */ 22);
	
	var _canvasRendererJs = __webpack_require__(/*! ./canvas-renderer.js */ 24);
	
	var _canvasRendererJs2 = _interopRequireDefault(_canvasRendererJs);
	
	var _enumJs = __webpack_require__(/*! ./enum.js */ 25);
	
	var _vec2Js = __webpack_require__(/*! ./vec2.js */ 20);
	
	var _vec2Js2 = _interopRequireDefault(_vec2Js);
	
	var _modalOverlayJs = __webpack_require__(/*! ./modal-overlay.js */ 26);
	
	var _modalOverlayJs2 = _interopRequireDefault(_modalOverlayJs);
	
	var _node_modulesDefaults = __webpack_require__(/*! ../~/defaults */ 6);
	
	var _node_modulesDefaults2 = _interopRequireDefault(_node_modulesDefaults);
	
	// Webpack: load stylesheet
	__webpack_require__(/*! ../assets/styles/playground.less */ 28);
	
	var counter = 0;
	
	var Playground = (function () {
		function Playground(opts) {
			_classCallCheck(this, Playground);
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				container: document.body,
				width: window.innerWidth,
				height: window.innerHeight
			});
			this.animator = null;
			this.runtime = 0;
	
			// Create DOM node
			this.el = document.createElement('div');
			this.el.classList.add('playground');
			this.el.id = 'pg-' + counter++;
			this.el.style.width = this.options.width + 'px';
			this.el.style.height = this.options.height + 'px';
	
			// Inject DOM node into container
			this.options.container.appendChild(this.el);
	
			// Initialize submodules
			this.clock = new _clockJs2['default']();
			this.gui = new Gui.Pane(this.el);
			this.simulator = new _simulatorJs2['default']({
				bounds: { left: 0, top: 0, width: this.options.width - this.gui.width, height: this.options.height }
			});
			this.renderer = new _canvasRendererJs2['default']();
	
			// Setup renderer DOM node
			this.renderer.el.width = this.el.clientWidth - this.gui.width;
			this.renderer.el.height = this.el.clientHeight;
			this.el.appendChild(this.renderer.el);
	
			// TODO: should this be stored as a member of Playground?
			this.selectedEntities = [];
	
			// Define tools (enum-like)
			// this.TOOL = new Enum('SELECT', 'CREATE', 'MOVE', 'ZOOM');
			this.tool = new _enumJs.TaggedUnion({
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
			this.events.contextmenu = function (e) {
				e.preventDefault();
				return false;
			};
			this.events.resize = function () {
				this.simulator.options.bounds.width = this.renderer.ctx.canvas.width = window.innerWidth - this.gui.width;
				this.simulator.options.bounds.height = this.renderer.ctx.canvas.height = window.innerHeight;
			};
			this.events.mousedown = function (e) {
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
						if (this.renderer.following !== null) {
							this.renderer.unfollow();
						}
						break;
	
					case this.tool.GRAB:
						this.renderer.setAltCursor(this.tool);
						this.selectedEntities.forEach(function (entity) {
							entity._fixed = entity.fixed;
							entity.fixed = true;
						});
						break;
				}
			};
			this.events.mousemove = function (e) {
				var delta = undefined;
				this.input.mouse.dx = e.layerX - this.input.mouse.x;
				this.input.mouse.dy = e.layerY - this.input.mouse.y;
				this.input.mouse.dragX = e.layerX - this.input.mouse.dragStartX;
				this.input.mouse.dragY = e.layerY - this.input.mouse.dragStartY;
				this.input.mouse.x = e.layerX;
				this.input.mouse.y = e.layerY;
	
				switch (this.tool._current) {
					case this.tool.PAN:
						if (this.input.mouse.isDown) {
							delta = new _vec2Js2['default'](this.input.mouse.dx, this.input.mouse.dy);
							this.renderer.camera.subtractSelf(delta);
						}
						break;
	
					case this.tool.GRAB:
						if (this.input.mouse.isDown) {
							delta = new _vec2Js2['default'](this.input.mouse.dx, this.input.mouse.dy);
							this.selectedEntities.forEach(function (entity) {
								entity.position.addSelf(delta);
								entity.velocity.set(delta.x, delta.y);
							});
						}
						break;
				}
			};
			this.events.mousewheel = function (e) {
				this.input.mouse.wheel = e.wheelDelta;
				this.simulator.parameters.createMass = Math.max(10, this.simulator.parameters.createMass + e.wheelDelta / 10);
			};
			this.events.mouseup = function (e) {
				var particle = undefined;
				this.input.mouse.isDown = false;
				this.input.mouse.dragX = e.layerX - this.input.mouse.dragStartX;
				this.input.mouse.dragY = e.layerY - this.input.mouse.dragStartY;
	
				switch (this.tool._current) {
					case this.tool.CREATE:
						particle = new _entityJs.Body(this.input.mouse.dragStartX + this.renderer.camera.x, this.input.mouse.dragStartY + this.renderer.camera.y, this.simulator.parameters.createMass, this.input.mouse.dragX / 50, this.input.mouse.dragY / 50);
						this.simulator.entities.push(particle);
						this.selectedEntities = [particle];
						this.events.selection(this.selectedEntities);
						break;
	
					case this.tool.SELECT:
						this.selectRegion(this.input.mouse.dragStartX + this.renderer.camera.x, this.input.mouse.dragStartY + this.renderer.camera.y, this.input.mouse.dragX, this.input.mouse.dragY);
						break;
	
					case this.tool.GRAB:
						this.renderer.setCursor(this.tool);
						this.selectedEntities.forEach(function (entity) {
							entity.fixed = entity._fixed;
						});
						break;
				}
			};
			this.events.selection = function (entities) {};
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
	
		_createClass(Playground, [{
			key: 'listen',
			value: function listen(eventName, handler) {
				this.events[eventName] = handler;
			}
		}, {
			key: 'selectRegion',
			value: function selectRegion(x, y, w, h) {
				this.selectedEntities.length = 0;
	
				this.selectedEntities = this.simulator.entities.filter(function (e) {
					return e.inRegion(x, y, w, h);
				});
	
				this.events.selection(this.selectedEntities);
	
				return this;
			}
		}, {
			key: 'deselect',
			value: function deselect() {
				this.selectedEntities.length = 0;
				this.events.selection(this.selectedEntities);
			}
		}, {
			key: 'setTool',
			value: function setTool(tool) {
				if (tool !== this.tool._current) {
					this.tool.setCurrent(tool);
					this.renderer.setCursor(this.tool);
				}
				return this;
			}
		}, {
			key: 'start',
			value: function start() {
				this.loop(1 / 60);
			}
		}, {
			key: 'pause',
			value: function pause() {
				this.paused = !this.paused;
				if (this.paused) {
					this.events.pause();
				} else {
					this.events.resume();
				}
			}
		}, {
			key: 'stop',
			value: function stop() {
				cancelAnimationFrame(this.animator);
				this.setTool(this.tool.NONE);
				this.deselect();
	
				var refreshMessage = new _modalOverlayJs2['default']('Simulation stopped', 'Reload the page to restart the simulation.', [{ text: 'Cancel', soft: true, onclick: function onclick(e) {
						refreshMessage.destroy();
					} }, { text: 'Reload', onclick: function onclick(e) {
						document.location.reload();
					} }], 'ion-ios-refresh-outline');
				refreshMessage.appendTo(this.el);
	
				// Blur background
				this.el.classList.add('defocus');
			}
		}, {
			key: 'reset',
			value: function reset() {
				this.simulator.reset();
				this.deselect();
			}
		}, {
			key: 'loop',
			value: function loop(t) {
				var dt = (t - this.runtime) / 10;
				this.runtime = t;
				this.animator = requestAnimationFrame(this.loop.bind(this));
				if (!this.paused) {
					this.simulator.update(dt);
				}
				this.renderer.render(this.simulator.entities, this.input, this.selectedEntities, this.simulator.stats, this.simulator.parameters, this.tool, this.simulator.options);
				// this.clock.tick();
			}
		}]);
	
		return Playground;
	})();
	
	exports['default'] = Playground;
	module.exports = exports['default'];

/***/ },
/* 19 */
/*!**************************!*\
  !*** ./src/simulator.js ***!
  \**************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _vec2Js = __webpack_require__(/*! ./vec2.js */ 20);
	
	var _vec2Js2 = _interopRequireDefault(_vec2Js);
	
	var _colliderJs = __webpack_require__(/*! ./collider.js */ 21);
	
	var _colliderJs2 = _interopRequireDefault(_colliderJs);
	
	var _node_modulesDefaults = __webpack_require__(/*! ../~/defaults */ 6);
	
	var _node_modulesDefaults2 = _interopRequireDefault(_node_modulesDefaults);
	
	var Simulator = (function () {
		function Simulator(opts) {
			_classCallCheck(this, Simulator);
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
				collisions: 'elastic',
				integrator: 'euler',
				bounded: true,
				friction: 0,
				gravity: false,
				bounds: { left: 0, top: 0, width: 100, height: 100 }
			});
			this.entities = [];
			this.collider = _colliderJs2['default'];
	
			this.stats = {
				totalKineticEnergy: 0,
				totalPotentialEnergy: 0,
				totalMomentum: new _vec2Js2['default'](0, 0),
				totalHeat: 0
			};
	
			this.parameters = {
				gravity: 6.67e-2,
				createMass: 100
			};
		}
	
		_createClass(Simulator, [{
			key: 'reset',
			value: function reset() {
				this.entities.length = 0;
			}
		}, {
			key: 'update',
			value: function update(dt) {
				var i = undefined,
				    len = undefined,
				    iA = undefined,
				    A = undefined,
				    iB = undefined,
				    B = undefined,
				    d = undefined,
				    dist2 = undefined,
				    f = undefined,
				    FA = undefined,
				    FB = undefined,
				    e = undefined,
				    next = undefined,
				    to_create = undefined,
				    v2 = undefined;
				this.stats.totalMass = 0;
				this.stats.totalKineticEnergy = 0;
				this.stats.totalPotentialEnergy = 0;
				this.stats.totalMomentum.zero();
	
				// Prune objects marked for deletion
				this.entities = this.entities.filter(function (e) {
					return !e.willDelete;
				});
	
				len = this.entities.length;
	
				// Force Accumulator
				for (iA = 0; iA < len; iA++) {
					A = this.entities[iA];
	
					if (!A.hasOwnProperty('mass') || A.fixed) {
						continue;
					}
	
					// Apply friction
					if (this.options.friction > 0) {
						v2 = A.velocity.magnitudeSq();
						if (v2 > 0) {
							A.applyForce(A.velocity.normalize().scaleSelf(-v2 * this.options.friction * A.radius / 100));
						}
					}
	
					if (this.options.gravity) {
						for (iB = iA + 1; iB < len; iB++) {
							B = this.entities[iB];
	
							if (!B.hasOwnProperty('mass') || B.fixed) {
								continue;
							}
	
							d = B.position.subtract(A.position).normalizeSelf();
							dist2 = A.position.distSq(B.position);
							f = this.parameters.gravity * A.mass * B.mass / dist2;
							FA = d.scale(f);
							FB = d.scale(-f);
	
							A.applyForce(FA);
							B.applyForce(FB);
	
							// Not sure why we need to multiply this by two...
							// But the conservation of energy mostly works out if we do
							this.stats.totalPotentialEnergy -= 2 * f * Math.sqrt(dist2);
						}
					}
				}
	
				// Integrator
				for (i = 0; i < len; i++) {
					e = this.entities[i];
					if (e.fixed) {
						e.acceleration.zero();
						e.velocity.zero();
						continue;
					}
	
					switch (this.options.integrator) {
						case 'euler':
							e.velocity.addSelf(e.acceleration.scale(dt));
							e.lastPosition = e.position;
							e.position.addSelf(e.velocity.scale(dt));
							e.acceleration.zero();
							break;
	
						case 'verlet':
							e.velocity = e.position.subtract(e.lastPosition);
							// next = e.position.add(e.velocity.scale(dt)).addSelf(e.acceleration.scale(dt * dt));
							next = e.position.add(e.velocity).addSelf(e.acceleration.scale(dt * dt));
							e.lastPosition = e.position;
							e.position = next;
							e.velocity = next.subtract(e.lastPosition);
							e.acceleration.zero();
							break;
	
						case 'RK4':
							break;
	
						default:
							this.stop();
					}
	
					if (e.hasOwnProperty('mass')) {
						this.stats.totalMass += e.mass;
						this.stats.totalKineticEnergy += e.kineticEnergy;
						this.stats.totalMomentum.addSelf(e.momentum);
					}
				}
	
				to_create = this.collider(this.entities, this.options.collisions, this.options.bounded, this.options.bounds, dt);
	
				for (i = 0, len = to_create.length; i < len; i++) {
					this.entities.push(to_create[i]);
				}
			}
		}]);
	
		return Simulator;
	})();
	
	exports['default'] = Simulator;
	module.exports = exports['default'];

/***/ },
/* 20 */
/*!*********************!*\
  !*** ./src/vec2.js ***!
  \*********************/
/***/ function(module, exports) {

	// Vector Processor
	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Vec3 = (function () {
	    function Vec3(x, y, z) {
	        _classCallCheck(this, Vec3);
	
	        this.x = x;
	        this.y = y;
	        this.z = z;
	    }
	
	    _createClass(Vec3, [{
	        key: "cross",
	        value: function cross(v) {
	            return new Vec3(this.y * v.z - this.z * v.y, this.x * v.z - this.z * v.x, this.x * v.y - this.y * v.x);
	        }
	    }]);
	
	    return Vec3;
	})();
	
	exports.Vec3 = Vec3;
	
	var Vec2 = (function () {
	    function Vec2(x, y) {
	        _classCallCheck(this, Vec2);
	
	        this.x = x;
	        this.y = y;
	    }
	
	    _createClass(Vec2, [{
	        key: "set",
	        value: function set(x, y) {
	            this.x = x;
	            this.y = y;
	            return this;
	        }
	    }, {
	        key: "transform",
	        value: function transform(fn, args) {
	            return new Vec2(fn.apply(null, [this.x].concat(args)), fn.apply(null, [this.y].concat(args)));
	        }
	    }, {
	        key: "transformSelf",
	        value: function transformSelf(fn, args) {
	            this.x = fn.apply(null, [this.x].concat(args));
	            this.y = fn.apply(null, [this.y].concat(arge));
	        }
	    }, {
	        key: "setPolar",
	        value: function setPolar(r, theta) {
	            this.x = r * Math.cos(theta);
	            this.y = r * Math.sin(theta);
	        }
	    }, {
	        key: "add",
	        value: function add(v) {
	            return new Vec2(this.x + v.x, this.y + v.y);
	        }
	    }, {
	        key: "subtract",
	        value: function subtract(v) {
	            return new Vec2(this.x - v.x, this.y - v.y);
	        }
	    }, {
	        key: "scale",
	        value: function scale(v) {
	            return new Vec2(this.x * v, this.y * v);
	        }
	    }, {
	        key: "magnitude",
	        value: function magnitude() {
	            return Math.sqrt(this.x * this.x + this.y * this.y);
	        }
	    }, {
	        key: "magnitudeSq",
	        value: function magnitudeSq() {
	            return this.x * this.x + this.y * this.y;
	        }
	    }, {
	        key: "midpoint",
	        value: function midpoint(v) {
	            return new Vec2(0.5 * (this.x + v.x), 0.5 * (this.y + v.y));
	        }
	    }, {
	        key: "dot",
	        value: function dot(v) {
	            return this.x * v.x + this.y * v.y;
	        }
	    }, {
	        key: "crossMag",
	        value: function crossMag(v) {
	            return this.x * v.y - this.y * v.x;
	        }
	    }, {
	        key: "copy",
	        value: function copy(v) {
	            return new Vec2(v.x, v.y);
	        }
	    }, {
	        key: "angle",
	        value: function angle() {
	            return Math.atan2(this.y, this.x);
	        }
	    }, {
	        key: "angleFrom",
	        value: function angleFrom(v) {
	            return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
	        }
	    }, {
	        key: "normalize",
	        value: function normalize() {
	            var iMag = 1 / this.magnitude();
	            return new Vec2(this.x * iMag, this.y * iMag);
	        }
	    }, {
	        key: "dist",
	        value: function dist(v) {
	            var dx = v.x - this.x;
	            var dy = v.y - this.y;
	            return Math.sqrt(dx * dx + dy * dy);
	        }
	    }, {
	        key: "distSq",
	        value: function distSq(v) {
	            var dx = v.x - this.x;
	            var dy = v.y - this.y;
	            return dx * dx + dy * dy;
	        }
	    }, {
	        key: "addSelf",
	        value: function addSelf(v) {
	            this.x += v.x;
	            this.y += v.y;
	            return this;
	        }
	    }, {
	        key: "subtractSelf",
	        value: function subtractSelf(v) {
	            this.x -= v.x;
	            this.y -= v.y;
	            return this;
	        }
	    }, {
	        key: "scaleSelf",
	        value: function scaleSelf(k) {
	            this.x *= k;
	            this.y *= k;
	            return this;
	        }
	    }, {
	        key: "zero",
	        value: function zero() {
	            this.x = 0;
	            this.y = 0;
	            return this;
	        }
	    }, {
	        key: "normalizeSelf",
	        value: function normalizeSelf() {
	            var iMag = 1 / this.magnitude();
	            this.x *= iMag;
	            this.y *= iMag;
	            return this;
	        }
	    }, {
	        key: "inspect",
	        value: function inspect() {
	            var n = arguments.length <= 0 || arguments[0] === undefined ? 2 : arguments[0];
	            return "(" + this.x.toFixed(n) + ", " + this.y.toFixed(n) + ")";
	        }
	    }, {
	        key: "toString",
	        value: function toString() {
	            return this.inspect(2);
	        }
	    }], [{
	        key: "add",
	        value: function add(a, b) {
	            return new Vec2(a.x + b.x, a.y + b.y);
	        }
	    }, {
	        key: "subtract",
	        value: function subtract(a, b) {
	            return new Vec2(a.x - b.x, a.y - b.y);
	        }
	    }, {
	        key: "scale",
	        value: function scale(a, k) {
	            return new Vec2(k * a.x, k * a.y);
	        }
	    }, {
	        key: "normalize",
	        value: function normalize(a) {
	            return new Vec2(k * a.x, k * a.y);
	        }
	    }]);
	
	    return Vec2;
	})();
	
	exports["default"] = Vec2;

/***/ },
/* 21 */
/*!*************************!*\
  !*** ./src/collider.js ***!
  \*************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	exports['default'] = collider;
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _vec2Js = __webpack_require__(/*! ./vec2.js */ 20);
	
	var _vec2Js2 = _interopRequireDefault(_vec2Js);
	
	var _entityJs = __webpack_require__(/*! ./entity.js */ 22);
	
	function collider(entities, response, bounded, bounds, dt) {
		var displacement = undefined,
		    A_momentum = undefined,
		    Av = undefined,
		    Avn = undefined,
		    B_momentum = undefined,
		    Bv = undefined,
		    Bvn = undefined,
		    C_momentum = undefined,
		    C_velocity = undefined,
		    F = undefined,
		    M = undefined,
		    M_inverse = undefined,
		    R = undefined,
		    absorbtionRate = undefined,
		    dist = undefined,
		    dm = undefined,
		    k = undefined,
		    mA = undefined,
		    mB = undefined,
		    overlap = undefined,
		    pA = undefined,
		    pA1 = undefined,
		    pB = undefined,
		    pB1 = undefined,
		    s = undefined,
		    un = undefined,
		    ut = undefined;
	
		// Keep track of which entities to create after this
		var to_create = [];
	
		entities.forEach(function (A, iA) {
			if (A.ignoreCollisions) {
				return;
			}
	
			// Bound points within container
			// Apply spring force when out of bounds
			if (bounded) {
				k = 2000;
				displacement = A.position.x - A.radius - bounds.left;
				if (displacement <= 0) {
					// A.applyForce(new Vec2(-k * displacement, 0));
					A.velocity.x = A.restitution * Math.abs(A.velocity.x);
				}
				displacement = A.position.x + A.radius - bounds.width;
				if (displacement >= 0) {
					// A.applyForce(new Vec2(-k * displacement, 0));
					A.velocity.x = -A.restitution * Math.abs(A.velocity.x);
				}
				displacement = A.position.y - A.radius - bounds.top;
				if (displacement <= 0) {
					// A.applyForce(new Vec2(0, -k * displacement));
					A.velocity.y = A.restitution * Math.abs(A.velocity.y);
				}
				displacement = A.position.y + A.radius - bounds.height;
				if (displacement >= 0) {
					// A.applyForce(new Vec2(0, -k * displacement));
					A.velocity.y = -A.restitution * Math.abs(A.velocity.y);
				}
			}
	
			entities.slice(iA + 1).forEach(function (B, iB) {
				if (B.ignoreCollisions) {
					return;
				}
	
				dist = A.position.dist(B.position);
				// dist2 = A.position.distSq(B.position);
				overlap = A.radius + B.radius - dist;
				absorbtionRate = overlap / 5;
	
				if (overlap >= 0) {
					// console.log('collision', this.collisions);
	
					// Total mass
					M = A.mass + B.mass;
					M_inverse = 1 / M;
	
					switch (response) {
						case 'merge':
							// Calculate new velocity from individual momentums
							A_momentum = A.velocity.scale(A.mass);
							B_momentum = B.velocity.scale(B.mass);
							C_momentum = A_momentum.add(B_momentum);
							C_velocity = C_momentum.scale(M_inverse);
	
							// Solve for center of mass
							R = A.position.scale(A.mass).add(B.position.scale(B.mass)).scale(M_inverse);
	
							// Create new particle at center of mass
							to_create.push(new _entityJs.Body(R.x, R.y, M, C_velocity.x, C_velocity.y, false));
							console.log(iA, iB);
	
							// Remove old points
							A.willDelete = true;
							B.willDelete = true;
	
							// if( A.mass > B.mass) {
							// 	indices_to_delete.push(iB);
							// 	A.position.set(R.x, R.y);
							// 	A.setMass(M);
							// 	A.radius = Math.sqrt(A.mass);
							// 	A.velocity.set(C_velocity.x, C_velocity.y);
							// } else {
							// 	indices_to_delete.push(iA);
							// 	B.position.set(R.x, R.y);
							// 	B.setMass(M);
							// 	B.radius = Math.sqrt(B.mass);
							// 	B.velocity.set(C_velocity.x, C_velocity.y);
							// }
	
							break;
	
						case 'pass':
							k = 0.5;
							A.velocity = _vec2Js2['default'].add(A.velocity.scale(1.0 - k), B.velocity.scale(k * B.mass / A.mass));
							B.velocity = _vec2Js2['default'].add(B.velocity.scale(1.0 - k), A.velocity.scale(k * A.mass / B.mass));
							break;
	
						case 'absorb':
							dm = absorbtionRate;
							pA = A.velocity.scale(A.mass);
							pB = B.velocity.scale(B.mass);
							mA = A.mass + dm;
							mB = B.mass + dm;
							pA1 = A.velocity.scale(dm);
							pB1 = B.velocity.scale(dm);
	
							if (A.mass > B.mass) {
								A.velocity.addSelf(pA.add(pB1).normalizeSelf().scaleSelf(1 / mA));
								B.velocity.addSelf(pA.subtract(pB1).normalizeSelf().scaleSelf(1 / mB));
								A.setMass(A.mass + dm);
								B.setMass(B.mass - dm);
							} else {
								A.velocity.addSelf(pB.subtract(pA1).normalizeSelf().scaleSelf(1 / mA));
								B.velocity.addSelf(pB.add(pA1).normalizeSelf().scaleSelf(1 / mB));
								A.setMass(A.mass - dm);
								B.setMass(B.mass + dm);
							}
	
							// dpA = A.velocity.scale(dm);
							// dpB = B.velocity.scale(-dm);
	
							if (A.mass <= 0) A.willDelete = true;
							if (B.mass <= 0) B.willDelete = true;
							break;
	
						case 'elastic':
							// Bodies bounce off of each other
							// TODO: change position rather than velocity?
							// Or maybe we should apply an impulse?
	
							un = A.position.subtract(B.position).normalizeSelf();
							ut = new _vec2Js2['default'](-un.y, un.x);
							Avn = A.velocity.dot(un);
							Bvn = B.velocity.dot(un);
	
							// Modify Velocity (does not work with Verlet)
							// TODO: prevent entities from getting stuck to each other
							// by setting the velocity to always repel
							var _ref = [M_inverse * (Avn * (A.mass - B.mass) + 2 * B.mass * Bvn), M_inverse * (Bvn * (B.mass - A.mass) + 2 * A.mass * Avn)];
							Avn = _ref[0];
							Bvn = _ref[1];
							A.velocity = un.scale(Avn).addSelf(ut.scale(A.velocity.dot(ut)));
							B.velocity = un.scale(Bvn).addSelf(ut.scale(B.velocity.dot(ut)));
	
							// Impulse method
							// A.velocity = this.clock.dt *
							// vr.scale(-(1 + e)).dot(n) / (Am_inv + Bm_inv + ()
	
							break;
	
						case 'shatter':
							// Like elastic, but stars shatter if change
							// in momentum is too high (high impulse)
	
							un = A.position.subtract(B.position).normalizeSelf();
							ut = new _vec2Js2['default'](-un.y, un.x);
							Avn = A.velocity.dot(un);
							Bvn = B.velocity.dot(un);
	
							var _ref2 = [M_inverse * (Avn * (A.mass - B.mass) + 2 * B.mass * Bvn), M_inverse * (Bvn * (B.mass - A.mass) + 2 * A.mass * Avn)];
							Avn = _ref2[0];
							Bvn = _ref2[1];
	
							Av = un.scale(Avn).addSelf(ut.scale(A.velocity.dot(ut)));
							Bv = un.scale(Bvn).addSelf(ut.scale(B.velocity.dot(ut)));
	
							// Approximate force of collision
							// (same for A and B due to Newton's 3rd law)
							F = A.velocity.subtract(Av).magnitude() * A.mass;
	
							if (F > A.strength) {
								A.explode(Av, 3, Math.PI, entities);
							} else {
								A.velocity = Av;
							}
	
							if (F > B.strength) {
								B.explode(Bv, 3, Math.PI / 2, entities);
							} else {
								A.velocity = Av;
							}
	
							break;
	
						case 'explode':
							// Calculate new velocity from individual momentums
							A_momentum = A.velocity.scale(A.mass);
							B_momentum = B.velocity.scale(B.mass);
							C_momentum = A_momentum.add(B_momentum);
							C_velocity = C_momentum.scale(M_inverse);
	
							// Solve for center of mass
							R = A.position.scale(A.mass).add(B.position.scale(B.mass)).scale(M_inverse);
	
							// Create new star at center of mass
							s = new _entityJs.Body(R.x, R.y, M, C_velocity.x, C_velocity.y, false);
							entities.push(s);
							s.explode(C_velocity, 5, 2 * Math.PI, entities);
	
							// Remove old points
							A.willDelete = true;
							B.willDelete = true;
					}
				}
			});
		});
	
		entities = entities.filter(function (e) {
			return !e.willDelete;
		});
	
		// for (let i = 0, len = to_create.length; i < len; i++) {
		// 	entities.push(to_create[i]);
		// }
		return to_create;
	}
	
	module.exports = exports['default'];

/***/ },
/* 22 */
/*!***********************!*\
  !*** ./src/entity.js ***!
  \***********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _vec2Js = __webpack_require__(/*! ./vec2.js */ 20);
	
	var _vec2Js2 = _interopRequireDefault(_vec2Js);
	
	var Entity = (function () {
		function Entity(x, y, vx, vy) {
			_classCallCheck(this, Entity);
	
			this.name = 'Generic Entity';
			this.position = new _vec2Js2['default'](x, y);
			this.lastPosition = new _vec2Js2['default'](x - vx, y - vy);
			this.velocity = new _vec2Js2['default'](vx, vy);
			this.acceleration = new _vec2Js2['default'](0, 0);
			this.angle = 0;
			this.angularVelocity = 0;
			this.angularAcceleration = 0;
			this.radius = 10;
			this.ignoreCollisions = false;
			this.willDelete = false;
			this.color = 'rgba(255,255,255,0.5)';
			this.trailX = [];
			this.trailY = [];
		}
	
		_createClass(Entity, [{
			key: 'remove',
			value: function remove() {
				// this.entities.splice this.entities.indexOf(this.), 1
			}
		}, {
			key: 'inRegion',
			value: function inRegion(x, y, w, h) {
				var e_x = this.position.x;
				var e_y = this.position.y;
	
				var x0 = x,
				    x1 = x + w;
				var y0 = y,
				    y1 = y + h;
	
				var _ref = [Math.min(x0, x1), Math.max(x0, x1)];
				x0 = _ref[0];
				x1 = _ref[1];
				var _ref2 = [Math.min(y0, y1), Math.max(y0, y1)];
				y0 = _ref2[0];
				y1 = _ref2[1];
	
				var withinX = x0 - this.radius < e_x && e_x < x1 + this.radius;
				var withinY = y0 - this.radius < e_y && e_y < y1 + this.radius;
	
				return withinX && withinY;
			}
		}, {
			key: 'enableCollisions',
			value: function enableCollisions() {
				this.ignoreCollisions = false;
				return this;
			}
		}, {
			key: 'disableCollisions',
			value: function disableCollisions() {
				this.ignoreCollisions = true;
				return this;
			}
		}]);
	
		return Entity;
	})();
	
	exports.Entity = Entity;
	
	var Body = (function (_Entity) {
		_inherits(Body, _Entity);
	
		function Body(x, y, m, vx, vy) {
			var fixed = arguments.length <= 5 || arguments[5] === undefined ? false : arguments[5];
	
			_classCallCheck(this, Body);
	
			_get(Object.getPrototypeOf(Body.prototype), 'constructor', this).call(this, x, y, vx, vy);
			this.mass = m;
			this.radius = Math.sqrt(this.mass);
			this.type = 'star';
			this.restitution = 1;
			this.strength = 0;
			this.color = 'rgba(255,255,0,1)';
			this.fixed = fixed;
		}
	
		_createClass(Body, [{
			key: 'setMass',
			value: function setMass(m) {
				this.mass = m;
				this.radius = Math.sqrt(this.mass);
			}
		}, {
			key: 'applyForce',
			value: function applyForce(F) {
				if (this.fixed || this.mass === 0) {
					return;
				}
				// a = F / m
				this.acceleration.addSelf(F.scale(1 / this.mass));
			}
		}, {
			key: 'explode',
			value: function explode(velocity, n, spreadAngle, ent) {
				var imass = this.mass / n;
				var vimag = velocity.magnitude();
				var increment = spreadAngle / (n + 1);
				var refAngle = velocity.angle() - spreadAngle / 2;
	
				// Distance to start collisions (avoid overlap collisions)
				var d = Math.sqrt(imass) / Math.sin(increment / 2);
				// time delay to start collsions
				// Not sure why we need this constant
				// 10 seems to give the correct exact time
				// but we need a small buffer, so I use 11
				var t = 11 * d / vimag;
	
				for (var i = 1; i > n; i++) {
					var iv = new _vec2Js2['default']().setPolar(vimag, refAngle + i * increment);
					var s = new Body(this.position.x, this.position.y, imass, iv.x, iv.y, false).disableCollisions();
					ent.push(s);
					window.setTimeout(s.enableCollisions, t);
				}
	
				ent.splice(ent.indexOf(this), 1);
			}
		}, {
			key: 'kineticEnergy',
			get: function get() {
				return 0.5 * this.mass * this.velocity.magnitudeSq();
			}
		}, {
			key: 'momentum',
			get: function get() {
				return this.velocity.scale(this.mass);
			}
		}]);
	
		return Body;
	})(Entity);
	
	exports.Body = Body;

/***/ },
/* 23 */
/*!**********************!*\
  !*** ./src/clock.js ***!
  \**********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Clock = (function () {
		function Clock() {
			_classCallCheck(this, Clock);
	
			this._last = 0;
			this.time = Number.MIN_VALUE;
			this.timeScale = 1000;
			this.max_dt = 1 / 60;
			this.callbacks = [];
			this.dt = this.max_dt;
		}
	
		_createClass(Clock, [{
			key: "register",
			value: function register(cb) {
				this.callbacks.push(cb);
				return this;
			}
		}, {
			key: "tick",
			value: function tick() {
				this.dt = this.timeScale * Math.min(Date.now() - this._last, this.max_dt);
				this._last = this.time;
				this.time += this.dt;
	
				for (var i = 0, len = this.callbacks.length; i < len; i++) {
					this.callbacks[i]();
				}
				return this;
			}
		}, {
			key: "delta",
			get: function get() {
				// 0.001 * (Date.now() - this._last);
				return this.time - this._last;
			}
		}]);
	
		return Clock;
	})();
	
	exports["default"] = Clock;
	module.exports = exports["default"];

/***/ },
/* 24 */
/*!********************************!*\
  !*** ./src/canvas-renderer.js ***!
  \********************************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _vec2Js = __webpack_require__(/*! ./vec2.js */ 20);
	
	var _vec2Js2 = _interopRequireDefault(_vec2Js);
	
	var _entityJs = __webpack_require__(/*! ./entity.js */ 22);
	
	var _node_modulesDefaults = __webpack_require__(/*! ../~/defaults */ 6);
	
	var _node_modulesDefaults2 = _interopRequireDefault(_node_modulesDefaults);
	
	var CanvasRenderer = (function () {
		function CanvasRenderer(opts) {
			_classCallCheck(this, CanvasRenderer);
	
			// Set default options
			this.options = (0, _node_modulesDefaults2['default'])(opts, {
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
			this.camera = new _vec2Js2['default'](0, 0);
		}
	
		_createClass(CanvasRenderer, [{
			key: 'follow',
			value: function follow(entity) {
				if (entity instanceof _entityJs.Entity) {
					this.following = entity;
				}
			}
		}, {
			key: 'unfollow',
			value: function unfollow() {
				this.following = null;
			}
		}, {
			key: 'centerView',
			value: function centerView() {
				var centerX = undefined,
				    centerY = undefined;
	
				if (this.following !== null) {
					centerX = this.following.position.x - this.ctx.canvas.width / 2;
					centerY = this.following.position.y - this.ctx.canvas.height / 2;
					this.camera.set(centerX, centerY);
				}
			}
		}, {
			key: 'setCursor',
			value: function setCursor(tool) {
				var cursor = tool._currentData.cursor;
				var currentCursor = this.el.dataset.cursor;
				if (currentCursor !== cursor) {
					this.el.dataset.cursor = cursor;
				}
			}
		}, {
			key: 'setAltCursor',
			value: function setAltCursor(tool) {
				var cursor = tool._currentData.altCursor;
				var currentCursor = this.el.dataset.cursor;
				if (currentCursor !== cursor) {
					this.el.dataset.cursor = cursor;
				}
			}
		}, {
			key: 'render',
			value: function render(entities, input, selectedEntities, stats, params, tool, simOpts) {
				var KE = undefined,
				    PE = undefined,
				    TE = undefined,
				    Xend = undefined,
				    Yend = undefined,
				    e = undefined,
				    m = undefined,
				    momentum = undefined,
				    p1 = undefined,
				    p2 = undefined,
				    unv = undefined,
				    uv = undefined,
				    v = undefined,
				    inRadius = undefined,
				    willSelect = undefined,
				    selectTool = undefined,
				    x = undefined,
				    y = undefined,
				    i = undefined,
				    j = undefined,
				    len = undefined,
				    altCursor = undefined;
	
				this.ctx.fillStyle = 'rgba(0, 0, 0, ' + (1 - this.options.motionBlur) + ')';
				this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
				// this.ctx.fillStyle = 'rgba(255,255,255,0.5)';
	
				// Only increment lineDashOffset once per frame
				this.ctx.lineDashOffset = (this.ctx.lineDashOffset + 0.5) % 10;
	
				this.centerView();
	
				if (simOpts.bounded) {
					this.ctx.save();
					this.ctx.strokeStyle = '#444444';
					this.ctx.lineWidth = 8;
					this.ctx.strokeRect(simOpts.bounds.left - this.camera.x, simOpts.bounds.top - this.camera.y, simOpts.bounds.width, simOpts.bounds.height);
					this.ctx.restore();
				}
	
				altCursor = false;
	
				for (i = 0, len = entities.length; i < len; ++i) {
					e = entities[i];
	
					if (e.willDelete) {
						continue;
					}
	
					x = e.position.x - this.camera.x;
					y = e.position.y - this.camera.y;
					this.ctx.save();
					this.ctx.fillStyle = e.color;
					this.ctx.beginPath();
					this.ctx.arc(x, y, e.radius, 0, 2 * Math.PI, false);
					this.ctx.closePath();
					this.ctx.fill();
					this.ctx.restore();
	
					// Mouse interaction
					m = new _vec2Js2['default'](input.mouse.x, input.mouse.y);
					selectTool = tool._current === tool.SELECT;
					inRadius = m.distSq(e.position.subtract(this.camera)) < e.radius * e.radius && selectTool;
					willSelect = e.inRegion(input.mouse.dragStartX + this.camera.x, input.mouse.dragStartY + this.camera.y, input.mouse.dragX, input.mouse.dragY) && input.mouse.isDown && selectTool;
	
					if (inRadius && !input.mouse.isDown) {
						altCursor = true;
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
	
					// Trail Vectors
					if (this.options.trails && e instanceof _entityJs.Body) {
						// Add new positions
						if (this.frame % this.options.trailSpace === 0) {
							e.trailX.push(e.position.x);
							e.trailY.push(e.position.y);
						}
						// Prune excess trails
						while (e.trailX.length > this.options.trailLength) {
							e.trailX.shift();
						}
						while (e.trailY.length > this.options.trailLength) {
							e.trailY.shift();
						}
	
						this.ctx.strokeWidth = 1;
						this.ctx.strokeStyle = 'rgba(255,255,255,0.5)';
						this.ctx.save();
	
						for (j = 1; j < this.options.trailLength; ++j) {
							this.ctx.beginPath();
							if (this.options.trailFade) {
								this.ctx.globalAlpha = j / e.trailX.length;
							}
							this.ctx.moveTo(e.trailX[j - 1] - this.camera.x, e.trailY[j - 1] - this.camera.y);
							this.ctx.lineTo(e.trailX[j] - this.camera.x, e.trailY[j] - this.camera.y);
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
							var x0 = input.mouse.dragStartX;
							var x1 = x0 + input.mouse.dragX;
							var _ref = [Math.min(x0, x1), Math.max(x0, x1)];
							x0 = _ref[0];
							x1 = _ref[1];
	
							var y0 = input.mouse.dragStartY;
							var y1 = y0 + input.mouse.dragY;
	
							// do @ctx.beginPath
							var _ref2 = [Math.min(y0, y1), Math.max(y0, y1)];
							y0 = _ref2[0];
							y1 = _ref2[1];
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
	
							v = new _vec2Js2['default'](input.mouse.dragX, input.mouse.dragY);
							uv = v.normalize();
							unv = new _vec2Js2['default'](-uv.y, uv.x);
	
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
						}
	
						// Create entity preview around cursor
						this.ctx.strokeStyle = 'rgba(128,128,128,1)';
						this.ctx.beginPath();
						this.ctx.arc(x, y, Math.sqrt(params.createMass), 0, 2 * Math.PI, false);
						this.ctx.stroke();
				}
	
				if (altCursor) {
					this.setAltCursor(tool);
				} else if (tool._current === tool.SELECT) {
					this.setCursor(tool);
				}
	
				++this.frame;
			}
		}]);
	
		return CanvasRenderer;
	})();
	
	exports['default'] = CanvasRenderer;
	module.exports = exports['default'];

/***/ },
/* 25 */
/*!*********************!*\
  !*** ./src/enum.js ***!
  \*********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Enum = function Enum() {
		var _this = this;
	
		_classCallCheck(this, Enum);
	
		var i = 0;
	
		for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
			names[_key] = arguments[_key];
		}
	
		names.forEach(function (n) {
			_this[n] = i++;
		});
	};
	
	exports["default"] = Enum;
	
	var TaggedUnion = (function () {
		function TaggedUnion(hash) {
			_classCallCheck(this, TaggedUnion);
	
			this._data = [];
			this._current = null;
			this._currentData = null;
	
			var i = 0;
			for (var key in hash) {
				if (hash.hasOwnProperty(key)) {
					this[key] = i++;
					this._data.push(hash[key]);
				}
			}
			this.setCurrent(0);
		}
	
		_createClass(TaggedUnion, [{
			key: "setCurrent",
			value: function setCurrent(i) {
				if (i >= 0 && i < this._data.length) {
					this._current = i;
					this._currentData = this._data[i];
				}
			}
		}]);
	
		return TaggedUnion;
	})();

	exports.TaggedUnion = TaggedUnion;

/***/ },
/* 26 */
/*!******************************!*\
  !*** ./src/modal-overlay.js ***!
  \******************************/
/***/ function(module, exports, __webpack_require__) {

	
	// Webpack: load stylesheet
	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	__webpack_require__(/*! ../assets/styles/modal-overlay.less */ 27);
	
	var ModalOverlay = (function () {
		function ModalOverlay(title, message, actions) {
			var type = arguments.length <= 3 || arguments[3] === undefined ? 'info' : arguments[3];
	
			_classCallCheck(this, ModalOverlay);
	
			this.el = document.createElement('div');
			this.el.classList.add('modal-overlay');
			var $container = undefined,
			    $content = undefined,
			    $icon = undefined,
			    $title = undefined,
			    $message = undefined,
			    $actions = undefined,
			    $action = undefined;
	
			$container = document.createElement('div');
			$container.classList.add('container');
	
			$content = document.createElement('div');
			$content.classList.add('content');
	
			$icon = document.createElement('i');
			switch (type) {
				case 'success':
					$icon.classList.add('ion-ios-checkmark-outline');break;
				case 'warning':
					$icon.classList.add('ion-ios-minus-outline');break;
				case 'error':
					$icon.classList.add('ion-ios-minus-outline');break;
				case 'help':
					$icon.classList.add('ion-ios-help-outline');break;
				case 'info':
					$icon.classList.add('ion-ios-information-outline');break;
				default:
					$icon.classList.add(type);
			}
			$content.appendChild($icon);
	
			$title = document.createElement('h1');
			$title.innerText = title;
			$content.appendChild($title);
	
			$message = document.createElement('p');
			$message.innerHTML = message;
			$content.appendChild($message);
	
			if (actions.length >= 0) {
				$actions = document.createElement('div');
				$actions.classList.add('actions');
				actions.forEach(function (action) {
					$action = document.createElement('a');
					if (action.soft) {
						$action.classList.add('soft');
					}
					$action.innerText = action.text;
					$action.addEventListener('click', action.onclick);
					$actions.appendChild($action);
				});
				$content.appendChild($actions);
			}
	
			$container.appendChild($content);
			this.el.appendChild($container);
		}
	
		_createClass(ModalOverlay, [{
			key: 'appendTo',
			value: function appendTo(container) {
				container.appendChild(this.el);
			}
		}, {
			key: 'destroy',
			value: function destroy() {
				var _this = this;
	
				this.el.classList.add('hidden');
	
				setTimeout(function () {
					_this.el.parentNode.removeChild(_this.el);
				}, 1000);
			}
		}]);
	
		return ModalOverlay;
	})();
	
	exports['default'] = ModalOverlay;
	module.exports = exports['default'];

/***/ },
/* 27 */
/*!******************************************!*\
  !*** ./assets/styles/modal-overlay.less ***!
  \******************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 28 */
/*!***************************************!*\
  !*** ./assets/styles/playground.less ***!
  \***************************************/
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 29 */
/*!*********************!*\
  !*** ./src/plot.js ***!
  \*********************/
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
		value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _utilJs = __webpack_require__(/*! ./util.js */ 30);
	
	var Plot = (function () {
		function Plot(ctx) {
			var bgColor = arguments.length <= 1 || arguments[1] === undefined ? '#000000' : arguments[1];
			var interval = arguments.length <= 2 || arguments[2] === undefined ? 100 : arguments[2];
	
			_classCallCheck(this, Plot);
	
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
	
		_createClass(Plot, [{
			key: 'addSeries',
			value: function addSeries(description, color, maxValue, update) {
				this._series.push({ description: description, color: color, update: update, maxValue: maxValue });
				return this;
			}
		}, {
			key: 'render',
			value: function render() {
				var _this = this;
	
				window.setTimeout(this.render.bind(this), this._pollInterval);
	
				var w = this.ctx.canvas.width;
				var h = this.ctx.canvas.height;
	
				this.ctx.save();
	
				// Move entire plot one pixel left
				var imageData = this.ctx.getImageData(0, 0, w, h);
				this.ctx.putImageData(imageData, -1, 0);
				var x = w - 1;
				// this.ctx.fillStyle = this._bgColor;
				this.ctx.clearRect(x, -h / 2, 1, h);
				this.ctx.fillStyle = '#333333';
				this.ctx.fillRect(x, 0, 1, 1);
	
				// Plot one pixel for each series
				this._series.forEach(function (s) {
					var val = (0, _utilJs.mapRange)(s.update(), 0, s.maxValue, 0, h / 2);
					_this.ctx.fillStyle = s.color;
					_this.ctx.fillRect(x, val, 1, 1);
				});
	
				this.ctx.restore();
			}
		}]);
	
		return Plot;
	})();
	
	exports['default'] = Plot;
	module.exports = exports['default'];

/***/ },
/* 30 */
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.wrapAround = wrapAround;
	exports.clamp = clamp;
	exports.mapRange = mapRange;
	
	function wrapAround(value, modulus) {
		return value > 0 ? value % modulus : value + modulus;
	}
	
	function clamp(value, a, b) {
		return a < b ? Math.min(b, Math.max(a, value)) : Math.min(a, Math.max(b, value));
	}
	
	function mapRange(val, min, max, newMin, newMax) {
		return (val - min) / (max - min) * (newMax - newMin) + newMin;
	}

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map