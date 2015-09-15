import * as GUI from './src/gui/index.js';
import Playground from './src/playground.js';
import Plot from './src/plot.js';
import Entity from './src/entity.js';
import Particle from './src/particle.js';
import Spring from './src/spring.js';
import ModalOverlay from './src/modal-overlay.js';
import { TaggedUnion } from './src/enum.js';
import Vec2 from './src/vec2.js';

// Global variables
let tool, p, selectedEntities, isolatedEntity,
	aboutTab, editorTab, inspectorTab, statsTab,
	infoBin, info,
	shareBin, twitter, github,
	player, playButton, startButton, resetButton, fullScreenButton,
	toolBin, createTool, selectTool, panTool, zoomTool, grabTool,
	propertiesBin,
	physicsBin, gravity, friction, bounded, collisions,
	appearance, trails, trailLength, trailFade, motionBlur, debug,
	statsBin, ke, pe, te, momentum, statPlot;

// Container for entity property controllers
let entityProp = {
	onPauseHandle: null, onResumeHandle: null,
	name: null, xpos: null, ypos: null, color: null, mass: null,
	fixed: null, collidable: null, follow: null, remove: null,
	entity: null
};

window.addEventListener('load', () => {
	p = new Playground({
		container: document.body
	});
	window.p = p;

	selectedEntities = new Set();
	isolatedEntity = null;
	// TODO: temp state fix
	p.isolatedEntity = isolatedEntity;

	// Define tools (enum-like)
	// this.TOOL = new Enum('SELECT', 'CREATE', 'MOVE', 'ZOOM');
	tool = new TaggedUnion({
		SELECT: { cursor: 'default', altCursor: 'pointer' },
		CREATE: { cursor: 'crosshair' },
		PAN: { cursor: 'move' },
		ZOOM: { cursor: 'zoom-in', altCursor: 'zoom-out' },
		GRAB: { cursor: 'grab', altCursor: 'grabbing' },
		NONE: { cursor: 'not-allowed' }
	});

	// Create GUI
	aboutTab = new GUI.Tab('About', { icon: 'ion-ios-information-outline' });
	p.gui.addTab(aboutTab);

	editorTab = new GUI.Tab('Editor', { icon: 'ion-ios-toggle-outline' });
	p.gui.addTab(editorTab);

	inspectorTab = new GUI.Tab('Inspector', { icon: 'ion-ios-glasses-outline' });
	p.gui.addTab(inspectorTab);

	statsTab = new GUI.Tab('Stats', { icon: 'ion-ios-pulse' });
	p.gui.addTab(statsTab);

	infoBin = new GUI.Bin('Information', { showTitle: false });
	info = new GUI.HTMLController('Introduction', {});
	info.setHTML('<h1>Particle Playground</h1>' +
		'<p>This is a sandbox for simulating 2D particle physics. Play around to see what you can do!</p>' +
		// '<p><a class="button">View instructions</a></p>' +
		'<hr>' +
		'<small>Created by <a href="https://twitter.com/mdciotti" target="_blank">@mdciotti</a> // ' +
		'<a href="https://github.com/mdciotti/particle-playground" target="_blank">v0.1.0-alpha</a></small>'
	);
	infoBin.addController(info);
	aboutTab.addBin(infoBin);

	shareBin = new GUI.Bin('Share');
	twitter = new GUI.ActionController('Twitter', { icon: 'ion-social-twitter-outline', action: () => {
		window.open('https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fdev.dev%2Flabs%2Fparticle-playground%2F&ref_src=twsrc%5Etfw&text=Particle%20Playground&tw_p=tweetbutton&url=http%3A%2F%2Fdev.dev%2Flabs%2Fparticle-playground%2F&via=mdciotti');
	}});
	github = new GUI.ActionController('GitHub', { icon: 'ion-social-github-outline', action: () => {
		window.open('https://github.com/mdciotti/particle-playground');
	}});
	shareBin.addControllers(twitter, github);
	aboutTab.addBin(shareBin);

	player = new GUI.GridBin('Simulation');
	playButton = new GUI.GridController('play state', {
		shortcut: 'P', type: 'toggle', disabled: true, state: 1, states: [
			{ tooltip: 'play', icon: 'ion-ios-play-outline' },
			{ tooltip: 'pause', icon: 'ion-ios-pause-outline' }
		], onclick: () => { p.pause(); }
	});
	startButton = new GUI.GridController('start', {
		shortcut: 'Q', type: 'toggle', disabled: false, state: 0, states: [
			{ tooltip: 'start', icon: 'ion-ios-play-outline', onclick: () => { p.start(); } },
			{ tooltip: 'stop', icon: 'ion-ios-close-outline', onclick: () => { p.stop(); } }
		], onclick: function () { /*this.toggle(0);*/ }
	});
	resetButton = new GUI.GridController('reset', {
		shortcut: 'R', type: 'action', disabled: true, state: 0, states: [
			{ tooltip: 'reset', icon: 'ion-ios-refresh-outline', onclick: () => { p.reset(); } }
		]
	});
	fullScreenButton = new GUI.GridController('full screen', {
		shortcut: 'F', type: 'action', state: 0, states: [
			{ tooltip: 'enter full screen', icon: 'ion-ios-monitor-outline', onclick: () => { p.toggleFullScreen(); } },
			{ tooltip: 'exit full screen', icon: 'ion-ios-monitor', onclick: () => { p.toggleFullScreen(); } }
		]
	});
	player.addControllers(playButton, startButton, resetButton, fullScreenButton);
	editorTab.addBin(player);

	toolBin = new GUI.GridBin('Tools', { selectable: true });
	createTool = new GUI.GridController('create', {
		shortcut: 'C', type: 'toggle', disabled: false, selected: true, state: 0, states: [
			{ tooltip: 'create', icon: 'ion-ios-plus-outline' }
		], onclick: () => { setTool(tool.CREATE); }
	});
	selectTool = new GUI.GridController('select', {
		shortcut: 'S', type: 'toggle', disabled: false, state: 0, states: [
			{ tooltip: 'select', icon: 'ion-ios-crop' }
		], onclick: () => { setTool(tool.SELECT); }
	});
	panTool = new GUI.GridController('pan', {
		shortcut: 'P', type: 'toggle', disabled: false, state: 0, states: [
			{ tooltip: 'pan', icon: 'ion-arrow-move' }
		], onclick: () => { setTool(tool.PAN); }
	});
	zoomTool = new GUI.GridController('zoom', {
		shortcut: 'Z', type: 'toggle', disabled: true, state: 0, states: [
			{ tooltip: 'zoom', icon: 'ion-ios-search' }
		], onclick: () => { setTool(tool.ZOOM); }
	});
	grabTool = new GUI.GridController('select', {
		shortcut: 'G', type: 'toggle', disabled: false, state: 0, states: [
			{ tooltip: 'grab', icon: 'ion-android-hand' }
		], onclick: () => { setTool(tool.GRAB); }
	});
	toolBin.addControllers(createTool, selectTool, panTool, zoomTool, grabTool);
	editorTab.addBin(toolBin);

	propertiesBin = new GUI.CollectionBin('Properties', {
		setControllers: e => {
			// Remove previous pause/resume listeners
			p.off('pause', entityProp.onPauseHandle);
			p.off('resume', entityProp.onResumeHandle);

			entityProp.entity = e;
			entityProp.name = new GUI.TextController('name', e.name, { onchange: val => { e.name = val; } });
			entityProp.xpos = new GUI.NumberController('pos.x', e.position.x, { decimals: 1, onchange: val => { e.position.x = val; } });
			entityProp.xpos.watch(() => { return e.position.x; });
			entityProp.ypos = new GUI.NumberController('pos.y', e.position.y, { decimals: 1, onchange: val => { e.position.y = val; } });
			entityProp.ypos.watch(() => { return e.position.y; });
			entityProp.color = new GUI.ColorController('color', e.color, { onchange: val => { e.color = val; } });
			propertiesBin.addControllers(entityProp.name, entityProp.xpos, entityProp.ypos, entityProp.color);

			if (e instanceof Particle) {
				entityProp.mass = new GUI.NumberController('mass', e.mass, { decimals: 0, step: 5, onchange: val => { e.setMass(val); } });
				entityProp.mass.watch(() => { return e.mass; });
				entityProp.fixed = new GUI.ToggleController('fixed', e.fixed, { onchange: val => { e.fixed = val; } });
				entityProp.collidable = new GUI.ToggleController('collidable', !e.ignoreCollisions, { onchange: val => { e.ignoreCollisions = !val; } });
				propertiesBin.addControllers(entityProp.mass, entityProp.fixed, entityProp.collidable);
			}

			entityProp.follow = new GUI.ActionController('follow', { icon: 'ion-ios-navigate-outline', action: () => { p.renderer.follow(e); } });
			entityProp.remove = new GUI.ActionController('delete', { icon: 'ion-ios-trash-outline', action: removeEntity.bind(entityProp) });
			propertiesBin.addControllers(entityProp.follow, entityProp.remove);

			if (p.paused) {
				entityProp.xpos.enable();
				entityProp.ypos.enable();
				entityProp.mass.enable();
			}

			entityProp.onPauseHandle = p.on('pause', onPause.bind(entityProp));
			entityProp.onResumeHandle = p.on('resume', onResume.bind(entityProp));

			isolatedEntity = e;
			// TODO: temp state fix
			p.isolatedEntity = isolatedEntity;
		}
	});
	inspectorTab.addBin(propertiesBin);

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
	editorTab.addBin(physicsBin);

	appearance = new GUI.Bin('Appearance');
	trails = new GUI.ToggleController('trails', p.renderer.options.trails, { onchange: (val) => { p.renderer.options.trails = val; } });
	trailLength = new GUI.NumberController('trail length', p.renderer.options.trailLength, { min: 0, max: 100, step: 5, onchange: (val) => { p.renderer.options.trailLength = val; } });
	trailFade = new GUI.ToggleController('trail fade', p.renderer.options.trailFade, { onchange: (val) => { p.renderer.options.trailFade = val; } });
	motionBlur = new GUI.NumberController('motion blur', p.renderer.options.motionBlur, { min: 0, max: 1, step: 0.1, onchange: (val) => { p.renderer.options.motionBlur = val; } });
	debug = new GUI.ToggleController('debug', p.renderer.options.debug, { onchange: (val) => { p.renderer.options.debug = val; } });
	appearance.addControllers(trails, trailLength, trailFade, motionBlur, debug);
	editorTab.addBin(appearance);

	function getKE() { return p.simulator.stats.totalKineticEnergy; }
	function getPE() { return p.simulator.stats.totalPotentialEnergy; }
	function getTE() { return p.simulator.stats.totalPotentialEnergy + p.simulator.stats.totalKineticEnergy + p.simulator.stats.totalHeat; }
	function getMomentum() { return p.simulator.stats.totalMomentum; }

	statsBin = new GUI.Bin('Stats');
	ke = new GUI.InfoController('Kinetic Energy', getKE, { interval: 100, format: 'number' });
	pe = new GUI.InfoController('Potential Energy', getPE, { interval: 100, format: 'number' });
	te = new GUI.InfoController('Total Energy', getTE, { interval: 100, format: 'number' });
	momentum = new GUI.InfoController('Momentum', getMomentum, { interval: 100 });
	statPlot = new GUI.CanvasController();
	statsBin.addControllers(ke, pe, te, momentum, statPlot);
	statsBin.disable();
	statsTab.addBin(statsBin);

	let plot1 = new Plot(statPlot.ctx);
	plot1.addSeries('KE', '#00aced', 1000, getKE);
	plot1.addSeries('PE', '#ed00ac', 1000, getPE);
	plot1.addSeries('TE', '#ededed', 1000, getTE);

	// `this` refers to the entityProp removed (defined at top)
	function removeEntity() {
		// console.log(this);
		this.entity.destroy();
		p.off('pause', this.onPauseHandle);
		p.off('resume', this.onResumeHandle);
		selectedEntities.delete(this.entity);
		setEntityControllers(selectedEntities);
		// delete this.name;
		// delete this.xpos;
		// delete this.ypos;
		// delete this.color;
		// delete this.mass;
		// delete this.fixed;
		// delete this.collidable;
		// delete this.follow;
		// delete this.remove;
		// delete this.entity;
		// delete this.onPauseHandle;
		// delete this.onResumeHandle;
		// TODO: check that properties controllers are being properly destroyed
	}

	function onPause() {
		// console.log(this, entityProp, this === entityProp);
		entityProp.xpos.unwatch();
		entityProp.ypos.unwatch();
		entityProp.mass.unwatch();
	}

	function onResume() {
		entityProp.xpos.rewatch();
		entityProp.ypos.rewatch();
		entityProp.mass.rewatch();
	}

	function setEntityControllers(entities) {
		// TODO: this is a temporary fix, see comment about managing state
		p.selectedEntities = entities;

		let collection = [];
		for (var e of entities.values()) { collection.push(e); }
		propertiesBin.setCollection(collection);
		if (collection.length === 0) {
			isolatedEntity = null;
			// TODO: temp state fix
			p.isolatedEntity = isolatedEntity;
		}
	}

	// Update properties bin on selection
	p.on('selection', setEntityControllers);

	p.on('keyup', e => {
		console.log(e.keyCode);
	});

	p.on('mousedown', e => {
		switch (tool._current) {
		case tool.PAN:
			if (p.renderer.following !== null) { p.renderer.unfollow(); }
			break;

		case tool.GRAB:
			p.renderer.setCursor(tool._currentData.altCursor);
			selectedEntities.forEach(entity => {
				entity._fixed = entity.fixed;
				entity.fixed = true;
			});
			break;
		}
	});
	p.on('mouseup', e => {
		if (p.input.mouse.dragStartedInCanvas) {
			switch (tool._current) {
			case tool.CREATE:
				let particle = new Particle(
					p.input.mouse.dragStartX + p.renderer.camera.x,
					p.input.mouse.dragStartY + p.renderer.camera.y,
					p.simulator.parameters.createMass,
					p.input.mouse.dragX / 50,
					p.input.mouse.dragY / 50
				);
				p.simulator.entities.push(particle);
				// deselect();
				// selectedEntities.add(particle);
				break;

			case tool.SELECT:
				selectRegion(
					p.input.mouse.dragStartX + p.renderer.camera.x,
					p.input.mouse.dragStartY + p.renderer.camera.y,
					p.input.mouse.dragX, p.input.mouse.dragY
				);
				break;

			case tool.GRAB:
				p.renderer.setCursor(tool._currentData.cursor);
				selectedEntities.forEach(entity => {
					entity.fixed = entity._fixed;
				});
				break;
			}
		}
	});
	p.on('mousemove', e => {
		let delta;

		switch (tool._current) {
			case tool.PAN:
				if (p.input.mouse.isDown) {
					delta = new Vec2(p.input.mouse.dx, p.input.mouse.dy);
					p.renderer.camera.subtractSelf(delta);
				}
				break;

			case tool.GRAB:
				if (p.input.mouse.isDown) {
					delta = new Vec2(p.input.mouse.dx, p.input.mouse.dy);
					selectedEntities.forEach(entity => {
						entity.position.addSelf(delta);
						entity.velocity.set(delta.x, delta.y);
					});
				}
				break;
		}
	});
	p.on('mousewheel', e => {
		let newCreateMass = Math.max(10, p.simulator.parameters.createMass + p.input.mouse.wheel / 10)
		p.simulator.parameters.createMass = newCreateMass;
	});
	p.on('start', () => {
		playButton.enable();
		resetButton.enable();
		startupScript();
	})
	p.on('stop', () => {
		playButton.disable();
		resetButton.disable();
		setTool(tool.NONE);
		deselect();

		let refreshMessage = new ModalOverlay({
			// title: 'Simulation stopped',
			message: '<p>Reload the page to restart the simulation.</p>',
			icon: 'none',
			actions: [
				{ text: 'Cancel', soft: true, onclick: (e) => { refreshMessage.destroy(); } },
				{ text: 'Reload', key: '<enter>', default: true, onclick: (e) => { document.location.reload(); } }
			],
			onopen: () => { p.el.classList.add('defocus'); },
			onclose: () => { p.el.classList.remove('defocus'); }
		});
		refreshMessage.appendTo(document.body);
	});
	p.on('reset', () => {
		deselect();
	});

	// TODO: move all tool/UI rendering into separate canvas?
	// temporary fix: attach state to playground
	// maybe have Playground store state?
	p.tool = tool;
	p.selectedEntities = selectedEntities;

	setTool(tool.CREATE);
	// p.start();

	// TODO: only show if not disabled in LocalStorage
	showStartScreen();
});


function selectRegion(x, y, w, h) {
	// TODO: support modifiers to add to/remove from selection
	selectedEntities.clear();

	selectedEntities = new Set(p.simulator.entities.filter(e => {
		return e.inRegion(x, y, w, h);
	}));

	p.dispatch('selection', selectedEntities);
}

function deselect() {
	selectedEntities.clear();
	p.dispatch('selection', selectedEntities);
}

function setTool(t) {
	if (t !== tool._current) {
		tool.setCurrent(t);
		p.renderer.setCursor(tool._currentData.cursor);
	}
}

function showStartScreen() {
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
			{ text: 'Start', key: '<enter>', default: true, onclick: (e) => { startInfo.destroy(); p.start(); startButton.setCurrent(1); } }
		],
		onopen: () => { p.el.classList.add('defocus'); },
		onclose: () => { p.el.classList.remove('defocus'); }
	});
	startInfo.appendTo(document.body);
}

function startupScript() {
	let x = window.innerWidth / 2;
	let y = window.innerHeight / 2;

	let p1 = new Particle(x - 30, y + 40, 100, 0, 0);
	let p2 = new Particle(x - 30, y - 40, 100, 0, 0);
	let p3 = new Particle(x + 30, y - 40, 100, 0, 0);
	let p4 = new Particle(x + 30, y + 40, 100, 0, 0);
	let s1 = new Spring(p1, p2, { restingDistance: 80 });
	let s2 = new Spring(p2, p3, { restingDistance: 60 });
	let s3 = new Spring(p3, p4, { restingDistance: 80 });
	let s4 = new Spring(p4, p1, { restingDistance: 60 });
	let s5 = new Spring(p1, p3, { restingDistance: 100 });
	let s6 = new Spring(p2, p4, { restingDistance: 100 });
	p.simulator.add(p1, p2, p3, p4, s1, s2, s3, s4, s5, s6);
}
