import * as Gui from './src/gui.js';
import Playground from './src/playground.js';
import Plot from './src/plot.js';
import { Entity, Body } from './src/entity.js';

window.addEventListener('load', () => {
	window.p = new Playground({
		container: document.body
	});

	// Create GUI
	let infoBin = new Gui.Bin('Information', 'html');
	infoBin.height = 16;
	let info = new Gui.HTMLController('Introduction', null);
	info.setHTML('<h1>Particle Playground</h1>' +
		'<p>This is a sandbox for simulating 2D particle physics. Play around to see what you can do!</p>' +
		'<hr>' +
		'<small>Created by <a href="https://twitter.com/mdciotti" target="_blank">@mdciotti</a> // ' +
		'<a href="https://github.com/mdciotti/particle-playground" target="_blank">v0.1.0-alpha</a></small>'
	);
	infoBin.addController(info);
	p.gui.addBin(infoBin);

	let toolBin = new Gui.Bin('Tools', 'grid');
	let tools = new Gui.GridController('tools', [
		{ tooltip: 'create', selected: true, disabled: false, icon: 'ion-ios-plus-outline', shortcut: 'C', onselect: () => { p.setTool('CREATE'); } },
		{ tooltip: 'select', selected: false, disabled: false, icon: 'ion-ios-crop', shortcut: 'S', onselect: () => { p.setTool('SELECT'); } },
		{ tooltip: 'pan', selected: false, disabled: true, icon: 'ion-arrow-move', shortcut: 'P', onselect: () => { p.setTool('PAN'); } },
		{ tooltip: 'zoom', selected: false, disabled: true, icon: 'ion-ios-search', shortcut: 'Z', onselect: () => { p.setTool('ZOOM'); } },
		{ tooltip: 'grab', selected: false, disabled: true, icon: 'ion-android-hand', shortcut: 'G', onselect: () => { p.setTool('GRAB'); } }
	]);
	toolBin.addController(tools);
	p.gui.addBin(toolBin);

	let propertiesBin = new Gui.Bin('Properties', 'list');
	p.gui.addBin(propertiesBin);

	let physicsBin = new Gui.Bin('Physics', 'list');
	let gravity = new Gui.ToggleController('gravity', p.simulator.options.gravity, { ontoggle: (val) => { p.simulator.options.gravity = val; } });
	let friction = new Gui.NumberController('friction', p.simulator.options.friction, { min: 0, onchange: (val) => { p.simulator.options.friction = val; } });
	let bounded = new Gui.ToggleController('bounded', p.simulator.options.bounded, { ontoggle: (val) => { p.simulator.options.bounded = val; } });
	let collisions = new Gui.DropdownController('collisions', [
		{ value: 'none', selected: false, disabled: false },
		{ value: 'elastic', selected: true, disabled: false },
		{ value: 'merge', selected: false, disabled: false },
		{ value: 'pass', selected: false, disabled: true, name: 'pass through' },
		{ value: 'absorb', selected: false, disabled: false },
		{ value: 'shatter', selected: false, disabled: false },
		{ value: 'explode', selected: false, disabled: false }
	], { onselect: (val) => { p.simulator.options.collisions = val; } });
	physicsBin.addControllers(gravity, friction, bounded, collisions);
	p.gui.addBin(physicsBin);

	let appearance = new Gui.Bin('Appearance', 'list');
	let trails = new Gui.ToggleController('trails', p.renderer.options.trails, { ontoggle: (val) => { p.renderer.options.trails = val; } });
	let trailLength = new Gui.NumberController('trail length', p.renderer.options.trailLength, { min: 0, max: 100, step: 5, onchange: (val) => { p.renderer.options.trailLength = val; } });
	let trailFade = new Gui.ToggleController('trail fade', p.renderer.options.trailFade, { ontoggle: (val) => { p.renderer.options.trailFade = val; } });
	let motionBlur = new Gui.NumberController('motion blur', p.renderer.options.motionBlur, { min: 0, max: 1, step: 0.1, onchange: (val) => { p.renderer.options.motionBlur = val; } });
	let vectors = new Gui.ToggleController('vectors', p.renderer.options.debug, { ontoggle: (val) => { p.renderer.options.debug = val; } });
	appearance.addControllers(trails, trailLength, trailFade, motionBlur, vectors);
	p.gui.addBin(appearance);

	let player = new Gui.Bin('Simulation', 'grid');
	let playerActions = new Gui.GridController('playerActions', [
		{ tooltip: 'pause', disabled: true, icon: 'ion-ios-pause-outline', shortcut: 'P', action: () => { p.simulator.pause(); } },
		{ tooltip: 'play', disabled: true, icon: 'ion-ios-play-outline', shortcut: ' ', action: () => { p.simulator.resume(); } },
		{ tooltip: 'stop', disabled: false, icon: 'ion-ios-close-outline', shortcut: '[ESC]', action: () => { p.stop(); } },
		{ tooltip: 'reset', disabled: false, icon: 'ion-ios-reload', shortcut: 'R', action: () => { p.simulator.reset(); } }
	], { type: 'action' });
	player.addController(playerActions);
	p.gui.addBin(player);

	function getKE() { return p.simulator.stats.totalKineticEnergy; }
	function getPE() { return p.simulator.stats.totalPotentialEnergy; }
	function getTE() { return p.simulator.stats.totalPotentialEnergy + p.simulator.stats.totalKineticEnergy + p.simulator.stats.totalHeat; }
	function getMomentum() { return p.simulator.stats.totalMomentum; }

	let statsBin = new Gui.Bin('Stats', 'list');
	let ke = new Gui.InfoController('Kinetic Energy', getKE, { interval: 100, format: 'number' });
	let pe = new Gui.InfoController('Potential Energy', getPE, { interval: 100, format: 'number' });
	let te = new Gui.InfoController('Total Energy', getTE, { interval: 100, format: 'number' });
	let momentum = new Gui.InfoController('Momentum', getMomentum, { interval: 100 });
	let canvas = new Gui.CanvasController();
	statsBin.addControllers(ke, pe, te, momentum, canvas);
	p.gui.addBin(statsBin);

	let plot1 = new Plot(canvas.ctx);
	plot1.addSeries('KE', '#00aced', 1000, getKE);
	plot1.addSeries('PE', '#ed00ac', 1000, getPE);
	plot1.addSeries('TE', '#ededed', 1000, getTE);

	// Update properties bin on selection
	p.setPropertiesBin = function (entity) {
		let name = new Gui.TextController('name', entity.name, { onchange: val => { entity.name = val; } });
		let xpos = new Gui.NumberController('pos.x', entity.position.x, { onchange: val => { entity.position.x = val; } });
		let ypos = new Gui.NumberController('pos.y', entity.position.y, { onchange: val => { entity.position.y = val; } });
		let color = new Gui.ColorController('color', entity.color, { onchange: val => { entity.color = val; } });
		propertiesBin.addControllers(name, xpos, ypos, color);
		if (Entity instanceof Body) {
			let mass = new Gui.NumberController('mass', entity.mass, { onchange: val => { entity.mass = val; } });
			propertiesBin.addController(mass);
		}
	};

	p.setTool('CREATE');
	p.start();
});
