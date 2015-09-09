import * as GUI from './src/gui/index.js';
import Playground from './src/playground.js';
import Plot from './src/plot.js';
import { Entity, Body } from './src/entity.js';
import ModalOverlay from './src/modal-overlay.js';

window.addEventListener('load', () => {
	window.p = new Playground({
		container: document.body
	});

	// Create GUI
	let infoBin, info,
		player, playButton, startButton, resetButton,
		toolBin, createTool, selectTool, panTool, zoomTool, grabTool,
		propertiesBin,
		physicsBin, gravity, friction, bounded, collisions,
		appearance, trails, trailLength, trailFade, motionBlur, vectors,
		statsBin, ke, pe, te, momentum, statPlot;

	infoBin = new GUI.Bin('Information');
	infoBin.height = 16;
	info = new GUI.HTMLController('Introduction', {});
	info.setHTML('<h1>Particle Playground</h1>' +
		'<p>This is a sandbox for simulating 2D particle physics. Play around to see what you can do!</p>' +
		// '<p><a class="button">View instructions</a></p>' +
		'<hr>' +
		'<small>Created by <a href="https://twitter.com/mdciotti" target="_blank">@mdciotti</a> // ' +
		'<a href="https://github.com/mdciotti/particle-playground" target="_blank">v0.1.0-alpha</a></small>'
	);
	infoBin.addController(info);
	p.gui.addBin(infoBin);

	player = new GUI.GridBin('Simulation');
	playButton = new GUI.GridController('play state', {
		shortcut: 'P', type: 'toggle', disabled: true, state: 1, states: [
			{ tooltip: 'play', icon: 'ion-ios-play-outline' },
			{ tooltip: 'pause', icon: 'ion-ios-pause-outline' }
		], onclick: () => { p.pause(); }
	});
	startButton = new GUI.GridController('start', {
		shortcut: 'Q', type: 'toggle', disabled: false, state: 0, states: [
			{ tooltip: 'start', icon: 'ion-ios-play-outline', onclick: () => { p.start(); playButton.enable(); resetButton.enable(); } },
			{ tooltip: 'stop', icon: 'ion-ios-close-outline', onclick: () => { p.stop(); playButton.disable(); resetButton.disable(); } }
		], onclick: function () { /*this.toggle(0);*/ }
	});
	resetButton = new GUI.GridController('reset', {
		shortcut: 'R', type: 'action', disabled: true, state: 0, states: [
			{ tooltip: 'reset', icon: 'ion-ios-reload', onclick: () => { p.reset(); } }
		]
	});
	player.addControllers(playButton, startButton, resetButton);
	p.gui.addBin(player);

	toolBin = new GUI.GridBin('Tools', { selectable: true });
	createTool = new GUI.GridController('create', {
		shortcut: 'C', type: 'toggle', disabled: false, selected: true, state: 0, states: [
			{ tooltip: 'create', icon: 'ion-ios-plus-outline' }
		], onclick: () => { p.setTool(p.tool.CREATE); }
	});
	selectTool = new GUI.GridController('select', {
		shortcut: 'S', type: 'toggle', disabled: false, state: 0, states: [
			{ tooltip: 'select', icon: 'ion-ios-crop' }
		], onclick: () => { p.setTool(p.tool.SELECT); }
	});
	panTool = new GUI.GridController('pan', {
		shortcut: 'P', type: 'toggle', disabled: false, state: 0, states: [
			{ tooltip: 'pan', icon: 'ion-arrow-move' }
		], onclick: () => { p.setTool(p.tool.PAN); }
	});
	zoomTool = new GUI.GridController('zoom', {
		shortcut: 'Z', type: 'toggle', disabled: true, state: 0, states: [
			{ tooltip: 'zoom', icon: 'ion-ios-search' }
		], onclick: () => { p.setTool(p.tool.ZOOM); }
	});
	grabTool = new GUI.GridController('select', {
		shortcut: 'G', type: 'toggle', disabled: false, state: 0, states: [
			{ tooltip: 'grab', icon: 'ion-android-hand' }
		], onclick: () => { p.setTool(p.tool.GRAB); }
	});
	toolBin.addControllers(createTool, selectTool, panTool, zoomTool, grabTool);
	p.gui.addBin(toolBin);

	propertiesBin = new GUI.Bin('Properties');
	p.gui.addBin(propertiesBin);

	physicsBin = new GUI.Bin('Physics');
	gravity = new GUI.ToggleController('gravity', p.simulator.options.gravity, { onchange: (val) => { p.simulator.options.gravity = val; } });
	friction = new GUI.NumberController('friction', p.simulator.options.friction, { min: 0, onchange: (val) => { p.simulator.options.friction = val; } });
	bounded = new GUI.ToggleController('bounded', p.simulator.options.bounded, { onchange: (val) => { p.simulator.options.bounded = val; } });
	collisions = new GUI.DropdownController('collisions', [
		{ name: 'none', selected: false, disabled: false },
		{ name: 'elastic', selected: true, disabled: false },
		{ name: 'merge', selected: false, disabled: false },
		{ name: 'pass through', selected: false, disabled: true, value: 'pass' },
		{ name: 'absorb', selected: false, disabled: false },
		{ name: 'shatter', selected: false, disabled: false },
		{ name: 'explode', selected: false, disabled: false }
	], { onchange: (val) => { p.simulator.options.collisions = val; } });
	physicsBin.addControllers(gravity, friction, bounded, collisions);
	p.gui.addBin(physicsBin);

	appearance = new GUI.Bin('Appearance', { open: false });
	trails = new GUI.ToggleController('trails', p.renderer.options.trails, { onchange: (val) => { p.renderer.options.trails = val; } });
	trailLength = new GUI.NumberController('trail length', p.renderer.options.trailLength, { min: 0, max: 100, step: 5, onchange: (val) => { p.renderer.options.trailLength = val; } });
	trailFade = new GUI.ToggleController('trail fade', p.renderer.options.trailFade, { onchange: (val) => { p.renderer.options.trailFade = val; } });
	motionBlur = new GUI.NumberController('motion blur', p.renderer.options.motionBlur, { min: 0, max: 1, step: 0.1, onchange: (val) => { p.renderer.options.motionBlur = val; } });
	vectors = new GUI.ToggleController('vectors', p.renderer.options.debug, { onchange: (val) => { p.renderer.options.debug = val; } });
	appearance.addControllers(trails, trailLength, trailFade, motionBlur, vectors);
	p.gui.addBin(appearance);

	function getKE() { return p.simulator.stats.totalKineticEnergy; }
	function getPE() { return p.simulator.stats.totalPotentialEnergy; }
	function getTE() { return p.simulator.stats.totalPotentialEnergy + p.simulator.stats.totalKineticEnergy + p.simulator.stats.totalHeat; }
	function getMomentum() { return p.simulator.stats.totalMomentum; }

	statsBin = new GUI.Bin('Stats', { open: false });
	ke = new GUI.InfoController('Kinetic Energy', getKE, { interval: 100, format: 'number' });
	pe = new GUI.InfoController('Potential Energy', getPE, { interval: 100, format: 'number' });
	te = new GUI.InfoController('Total Energy', getTE, { interval: 100, format: 'number' });
	momentum = new GUI.InfoController('Momentum', getMomentum, { interval: 100 });
	statPlot = new GUI.CanvasController();
	statsBin.addControllers(ke, pe, te, momentum, statPlot);
	statsBin.disable();
	p.gui.addBin(statsBin);

	let plot1 = new Plot(statPlot.ctx);
	plot1.addSeries('KE', '#00aced', 1000, getKE);
	plot1.addSeries('PE', '#ed00ac', 1000, getPE);
	plot1.addSeries('TE', '#ededed', 1000, getTE);

	function setEntityControllers(entities) {
		propertiesBin.removeAllControllers();
		if (entities.length === 0) {
			p.off('pause');
			p.off('resume');
			return;
		}
		let e, name, xpos, ypos, color, mass, fixed, collidable, follow, remove;

		e = entities[0];
		name = new GUI.TextController('name', e.name, { onchange: val => { e.name = val; } });
		xpos = new GUI.NumberController('pos.x', e.position.x, { decimals: 1, onchange: val => { e.position.x = val; } });
		xpos.watch(() => { return e.position.x; });
		ypos = new GUI.NumberController('pos.y', e.position.y, { decimals: 1, onchange: val => { e.position.y = val; } });
		ypos.watch(() => { return e.position.y; });
		color = new GUI.ColorController('color', e.color, { onchange: val => { e.color = val; } });
		propertiesBin.addControllers(name, xpos, ypos, color);

		if (e instanceof Body) {
			mass = new GUI.NumberController('mass', e.mass, { decimals: 0, onchange: val => { e.setMass(val); } });
			mass.watch(() => { return e.mass; });
			fixed = new GUI.ToggleController('fixed', e.fixed, { onchange: val => { e.fixed = val; } });
			collidable = new GUI.ToggleController('collidable', !e.ignoreCollisions, { onchange: val => { e.ignoreCollisions = !val; } });
			propertiesBin.addControllers(mass, fixed, collidable);
		}

		follow = new GUI.ActionController('follow', { action: () => { p.renderer.follow(e); } });
		remove = new GUI.ActionController('delete', { action: () => {
			e.willDelete = true;
			propertiesBin.removeAllControllers();
			entities.splice(0, 1);
			setEntityControllers(entities);
			xpos = null;
			ypos = null;
			color = null;
			mass = null;
			fixed = null;
			collidable = null;
			follow = null;
			remove = null;
			// TODO: check that properties controllers are being properly destroyed
		} });
		propertiesBin.addControllers(follow, remove);

		p.on('pause', () => {
			xpos.unwatch();
			ypos.unwatch();
			mass.unwatch();
		});
		p.on('resume', () => {
			xpos.rewatch();
			ypos.rewatch();
			mass.rewatch();
		});
	}

	// Update properties bin on selection
	p.on('selection', setEntityControllers);

	p.setTool(p.tool.CREATE);
	// p.start();

	let startInfo = new ModalOverlay({
		title: 'Particle Playground',
		titleSize: 'x-large',
		message: '<p>This is a sandbox for simulating two-dimensional particle physics. It is not intended to be physically accurate to any standard, instead it is best used for interactive entertainment.</p>' +
			'<p>It is written almost entirely from scratch in JavaScript, and is the culmination of about two years of on and off work. The <a href="https://github.com/mdciotti/particle-playground" target="_blank">source code</a> is available on Github.</p>' +
			'<p>You should check out <a href="http://mdc.io" target="_blank">my website</a> for more awesome stuff like this, or <a href="https://twitter.com/mdciotti" target="_blank">follow me on twitter</a>.</p>' +
			'<p>Feel free to share with friends or let me know what you think! If you run into any issues, or have any great ideas, don\'t hesitate to let me know.</p>',
		scrollable: true,
		icon: './assets/icons/noun_186392_cc.svg',
		iconType: 'external',
		actions: [
			{ text: 'Hide', soft: true, onclick: (e) => { /* TODO: set localstorage setings */ } },
			{ text: 'Instructions', onclick: (e) => { startInfo.destroy(); p.tour(); } },
			{ text: 'Start', key: '<enter>', default: true, onclick: (e) => { startInfo.destroy(); p.start(); playButton.enable(); resetButton.enable(); startButton.setCurrent(1); } }
		]
	});
	startInfo.appendTo(p.el);
});
