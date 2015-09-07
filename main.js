import * as Gui from './src/gui.js';
import Playground from './src/playground.js';
import Plot from './src/plot.js';
import { Entity, Body } from './src/entity.js';

window.addEventListener('load', () => {
	window.p = new Playground({
		container: document.body
	});

	// Create GUI
	let infoBin, info,
		player, playerActions,
		toolBin, tools,
		propertiesBin,
		physicsBin, gravity, friction, bounded, collisions,
		appearance, trails, trailLength, trailFade, motionBlur, vectors,
		statsBin, ke, pe, te, momentum, canvas;

	infoBin = new Gui.Bin('Information', 'html');
	infoBin.height = 16;
	info = new Gui.HTMLController('Introduction', null);
	info.setHTML('<h1>Particle Playground</h1>' +
		'<p>This is a sandbox for simulating 2D particle physics. Play around to see what you can do!</p>' +
		'<hr>' +
		'<small>Created by <a href="https://twitter.com/mdciotti" target="_blank">@mdciotti</a> // ' +
		'<a href="https://github.com/mdciotti/particle-playground" target="_blank">v0.1.0-alpha</a></small>'
	);
	infoBin.addController(info);
	p.gui.addBin(infoBin);


	player = new Gui.Bin('Simulation', 'grid');
	playerActions = new Gui.GridController('playerActions', [
		{ tooltip: 'pause', disabled: false, icon: 'ion-ios-pause-outline', shortcut: 'P',
			tooltip_alt: 'resume', icon_alt: 'ion-ios-play-outline', type: 'toggle',
			onchange: () => { p.pause(); }
		},
		{ tooltip: 'stop', disabled: false, icon: 'ion-ios-close-outline', shortcut: '[ESC]', type: 'action',
			action: function () {
				this.toggle(0);
				p.gui.disableAll();
				p.stop();
			}
		},
		{ tooltip: 'reset', disabled: false, icon: 'ion-ios-reload', shortcut: 'R', type: 'action', action: () => { p.reset(); } }
	], { type: 'mixed' });
	player.addController(playerActions);
	p.gui.addBin(player);

	toolBin = new Gui.Bin('Tools', 'grid');
	tools = new Gui.GridController('tools', [
		{ tooltip: 'create', selected: true, disabled: false, icon: 'ion-ios-plus-outline', shortcut: 'C', onselect: () => { p.setTool(p.tool.CREATE); } },
		{ tooltip: 'select', selected: false, disabled: false, icon: 'ion-ios-crop', shortcut: 'S', onselect: () => { p.setTool(p.tool.SELECT); } },
		{ tooltip: 'pan', selected: false, disabled: false, icon: 'ion-arrow-move', shortcut: 'P', onselect: () => { p.setTool(p.tool.PAN); } },
		{ tooltip: 'zoom', selected: false, disabled: true, icon: 'ion-ios-search', shortcut: 'Z', onselect: () => { p.setTool(p.tool.ZOOM); } },
		{ tooltip: 'grab', selected: false, disabled: false, icon: 'ion-android-hand', shortcut: 'G', onselect: () => { p.setTool(p.tool.GRAB); } }
	]);
	toolBin.addController(tools);
	p.gui.addBin(toolBin);

	propertiesBin = new Gui.Bin('Properties', 'list');
	p.gui.addBin(propertiesBin);

	physicsBin = new Gui.Bin('Physics', 'list');
	gravity = new Gui.ToggleController('gravity', p.simulator.options.gravity, { onchange: (val) => { p.simulator.options.gravity = val; } });
	friction = new Gui.NumberController('friction', p.simulator.options.friction, { min: 0, onchange: (val) => { p.simulator.options.friction = val; } });
	bounded = new Gui.ToggleController('bounded', p.simulator.options.bounded, { onchange: (val) => { p.simulator.options.bounded = val; } });
	collisions = new Gui.DropdownController('collisions', [
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

	appearance = new Gui.Bin('Appearance', 'list', false);
	trails = new Gui.ToggleController('trails', p.renderer.options.trails, { onchange: (val) => { p.renderer.options.trails = val; } });
	trailLength = new Gui.NumberController('trail length', p.renderer.options.trailLength, { min: 0, max: 100, step: 5, onchange: (val) => { p.renderer.options.trailLength = val; } });
	trailFade = new Gui.ToggleController('trail fade', p.renderer.options.trailFade, { onchange: (val) => { p.renderer.options.trailFade = val; } });
	motionBlur = new Gui.NumberController('motion blur', p.renderer.options.motionBlur, { min: 0, max: 1, step: 0.1, onchange: (val) => { p.renderer.options.motionBlur = val; } });
	vectors = new Gui.ToggleController('vectors', p.renderer.options.debug, { onchange: (val) => { p.renderer.options.debug = val; } });
	appearance.addControllers(trails, trailLength, trailFade, motionBlur, vectors);
	p.gui.addBin(appearance);

	function getKE() { return p.simulator.stats.totalKineticEnergy; }
	function getPE() { return p.simulator.stats.totalPotentialEnergy; }
	function getTE() { return p.simulator.stats.totalPotentialEnergy + p.simulator.stats.totalKineticEnergy + p.simulator.stats.totalHeat; }
	function getMomentum() { return p.simulator.stats.totalMomentum; }

	statsBin = new Gui.Bin('Stats', 'list', false);
	ke = new Gui.InfoController('Kinetic Energy', getKE, { interval: 100, format: 'number' });
	pe = new Gui.InfoController('Potential Energy', getPE, { interval: 100, format: 'number' });
	te = new Gui.InfoController('Total Energy', getTE, { interval: 100, format: 'number' });
	momentum = new Gui.InfoController('Momentum', getMomentum, { interval: 100 });
	canvas = new Gui.CanvasController();
	statsBin.addControllers(ke, pe, te, momentum, canvas);
	p.gui.addBin(statsBin);

	let plot1 = new Plot(canvas.ctx);
	plot1.addSeries('KE', '#00aced', 1000, getKE);
	plot1.addSeries('PE', '#ed00ac', 1000, getPE);
	plot1.addSeries('TE', '#ededed', 1000, getTE);

	function setEntityControllers(entities) {
		propertiesBin.removeAllControllers();
		if (entities.length === 0) { return; }
		let e, name, xpos, ypos, color, mass, fixed, collidable, follow, remove;

		e = entities[0];
		name = new Gui.TextController('name', e.name, { onchange: val => { e.name = val; } });
		xpos = new Gui.NumberController('pos.x', e.position.x, { decimals: 1, onchange: val => { e.position.x = val; } }).watch(() => { return e.position.x; });
		ypos = new Gui.NumberController('pos.y', e.position.y, { decimals: 1, onchange: val => { e.position.y = val; } }).watch(() => { return e.position.y; });
		color = new Gui.ColorController('color', e.color, { onchange: val => { e.color = val; } });
		propertiesBin.addControllers(name, xpos, ypos, color);
		if (e instanceof Body) {
			mass = new Gui.NumberController('mass', e.mass, { decimals: 0, onchange: val => { e.setMass(val); } }).watch(() => { return e.mass; });
			fixed = new Gui.ToggleController('fixed', e.fixed, { onchange: val => { e.fixed = val; } });
			collidable = new Gui.ToggleController('collidable', !e.ignoreCollisions, { onchange: val => { e.ignoreCollisions = !val; } });
			propertiesBin.addControllers(mass, fixed, collidable);
		}
		follow = new Gui.ActionController('follow', { action: () => { p.renderer.follow(e); } });
		remove = new Gui.ActionController('delete', { action: () => {
			e.willDelete = true;
			propertiesBin.removeAllControllers();
			entities.splice(0, 1);
			setEntityControllers(entities);
		} });
		propertiesBin.addControllers(follow, remove);

		p.listen('pause', () => {
			xpos.unwatch();
			ypos.unwatch();
			mass.unwatch();
		});
		p.listen('resume', () => {
			xpos.rewatch();
			ypos.rewatch();
			mass.rewatch();
		});
	}

	// Update properties bin on selection
	p.listen('selection', setEntityControllers);

	p.setTool(p.tool.CREATE);
	p.start();
});
