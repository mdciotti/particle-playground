// GRAPHICAL USER INTERFACE CONTROLLER

import defaults from '../node_modules/defaults';
// import defaults from '~defaults/index.js';

// Webpack: load stylesheet
require('../assets/styles/gui.less');

export class Bin {
	constructor(title, type, open = true) {
		this.title = title;
		this.type = type;
		this.height = null;
		this.container = null;
		this.controllers = [];
		this.node = null;
		this.node = document.createElement('details');
		this.node.classList.add('bin');

		let titlebar = document.createElement('summary');
		titlebar.classList.add('bin-title-bar');

		let icon = document.createElement('i');
		icon.classList.add('ion-ios-arrow-right');
		titlebar.appendChild(icon);

		let label = document.createElement('span');
		label.classList.add('bin-title');
		label.innerText = this.title;
		titlebar.appendChild(label);

		this.node.appendChild(titlebar);

		this.container = document.createElement('div');
		this.container.classList.add('bin-container');
		this.container.classList.add(`bin-${this.type}`);
		this.node.appendChild(this.container);

		if (open) { this.open(); }
	}

	isOpen() { return this.node.hasAttribute('open'); }
	open() { this.node.setAttribute('open', ''); }
	close() { this.node.removeAttribute('open'); }
	toggle() {
		if (this.isOpen()) { this.close(); }
		else { this.open(); }
	}

	setHeight(h) {
		this.container.style.height = `${this.height}px`;
	}

	addController(controller) {
		this.controllers.push(controller);
		this.container.appendChild(controller.node);
		controller.parent = this;
		this.height += controller.height;
		this.setHeight();
	}

	addControllers(...controllers) {
		controllers.forEach(this.addController.bind(this));
	}

	removeController(controller) {
		this.height -= controller.height;
		controller.destroy();
		this.setHeight();
		let i = this.controllers.indexOf(controller);
		delete this.controllers[i];
		// this.controllers.splice(i, 1);
	}

	removeAllControllers() {
		this.controllers.forEach(this.removeController.bind(this));
		this.controllers.length = 0;
	}
}

class Controller {
	constructor(type, title) {
		this.title = title;
		this.type = type;
		this.node = document.createElement('div');
		this.node.classList.add('bin-item', 'controller', type);
		this.parent = null;
		this.height = null;
		// this.node.appendChild();
	}

	listener(e) {
		this.value = e.target.value;
		// console.log(`Setting ${this.title}: ${this.value}`);
		// this.options.onchange(this.value);
	}

	destroy() {
		// TODO: ensure properly destruction
		this.node.parentNode.removeChild(this.node);
		this.node = null;
		this.parent = null;
	}
}

export class TextController extends Controller {
	constructor(title, value, opts) {
		super('text', title);
		this.value = value;
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			size: Number.MAX_VALUE,
			onchange: function (e) {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
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

	listener(e) {
		this.value = e.target.value;
		// console.log(`Setting ${this.title}: ${this.value}`);
		this.options.onchange(this.value);
	}
}

export class NumberController extends Controller {
	constructor(title, value, opts) {
		super('number', title);
		this.value = value;
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			min: null,
			max: null,
			step: null,
			onchange: function (val) {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
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

	listener(e) {
		this.value = e.target.value;
		// console.log(`Setting ${this.title}: ${this.value}`);
		this.options.onchange(parseFloat(this.value));
	}
}

export class ToggleController extends Controller {
	constructor(title, value, opts) {
		super('toggle', title);
		this.value = value;
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			onchange: function () {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
		name.classList.add('bin-item-name');
		name.innerText = title;
		label.appendChild(name);

		let input = document.createElement('input');
		input.classList.add('bin-item-value');
		input.type = 'checkbox';
		input.checked = this.value;
		label.appendChild(input);

		this.node.appendChild(label);

		input.addEventListener('change', this.listener.bind(this));
	}

	listener(e) {
		this.value = e.target.checked;
		// console.log(`Toggling ${this.title}: ${this.value ? 'on' : 'off'}`);
		this.options.onchange(this.value);
	}
}

export class DropdownController extends Controller {
	constructor(title, items, opts) {
		super('dropdown', title);
		// this.value = value;
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			onselect: function () {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
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

	createItems(list) {
		this.items = list;
		this.items.forEach(item => {
			let itemNode = document.createElement('option');
			itemNode.value = item.value;
			itemNode.innerText = item.hasOwnProperty('name') ? item.name : item.value;
			if (item.selected) {
				itemNode.selected = true;
				// this.value = item.value;
			}
			if (item.disabled) { itemNode.disabled = true; }
			this.input.appendChild(itemNode);
		});
	}

	listener(e) {
		this.value = this.input.value;
		// console.log(`Setting ${this.title}: ${this.value}`);
		this.options.onselect(this.value);
	}
}

export class HTMLController extends Controller {
	constructor(title, value, opts) {
		super('html', title);
		this.height = 160;
	}

	getHTML() { return this.node.innerHTML; }
	setHTML(content) { this.node.innerHTML = content; }
	// append(text) {}
}

export class GridController extends Controller {
	constructor(title, items, opts) {
		super('grid', title);
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			size: 'medium',
			type: 'select'
		});

		this.node = document.createDocumentFragment();
		this.createItems(items);
		this.selectedIndex = 0;
		this.multiSelection = [];
	}

	createItems(list) {
		this.height = 48 * Math.ceil(list.length / Math.floor(256 / 48));

		let i = 0;
		this.items = list;
		this.items.forEach(item => {
			let itemNode = document.createElement('div');
			itemNode.classList.add('bin-item');
			itemNode.dataset.index = i++;
			itemNode.title = item.tooltip;
			if (item.selected) { itemNode.classList.add('selected'); }
			if (item.disabled) { itemNode.classList.add('disabled'); }
			itemNode.addEventListener('click', e => { this.listener(e); });
			// itemNode.addEventListener('click', item.onclick);
			let icon = document.createElement('i');
			if (item.hasOwnProperty('icon') && item.icon.length > 0) { icon.classList.add(item.icon); }
			else if (item.hasOwnProperty('shortcut') && item.shortcut.length > 0) { icon.innerText = item.shortcut.toUpperCase().charAt(0); }
			itemNode.appendChild(icon);
			this.node.appendChild(itemNode);
		});
	}

	listener(e) {
		let el = e.target, i;
		while (el.parentElement !== null && typeof el.dataset.index === 'undefined') {
			el = el.parentElement;
		}
		if (typeof el.dataset.index !== 'undefined') {
			i = parseInt(el.dataset.index);
			if (this.options.type === 'select') { this.select(i); }
			else if (this.options.type === 'multi') { this.multiSelect(i); }
			else if (this.options.type === 'action') {
				if (!this.items[i].disabled) { this.items[i].action(el); }
			}
		}
	}

	select(i) {
		let children = Array.prototype.slice.call(this.parent.container.childNodes, 0);
		if (this.items[i].disabled) { return; }

		this.multiSelection.length = 0;
		// Deselect all
		this.selectedIndex = i;
		children.forEach(el => {
			el.classList.remove('selected');
		});
		// el = this.parent.container.querySelector(`.bin-item[data-index=${i}]`);
		children[i].classList.add('selected');
		this.items[i].onselect(children[i]);
	}

	multiSelect(i) {}
}

export class CanvasController extends Controller {
	constructor(opts) {
		super('canvas', 'canvas');
		this.height = 160;
		this.node = document.createElement('canvas');
		this.ctx = this.node.getContext('2d');
		this.node.height = this.height;
		this.node.width = 256;
	}
}

export class InfoController extends Controller {
	constructor(title, getter, opts) {
		super('info', title);
		this.height = 48;
		this.getter = getter;

		// Set default options
		this.options = defaults(opts, {
			interval: 100,
			decimals: 2,
			format: 'auto'
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
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

	watch() {
		setTimeout(this.watch.bind(this), this.options.interval);
		this.setInfo(this.getter());
	}

	setInfo(value) {
		let infoString, vx, vy;

		switch(this.options.format) {
			case 'text': infoString = value; break;
			case 'boolean': infoString = value ? 'True' : 'False'; break;
			case 'number': infoString = value.toFixed(this.options.decimals); break;
			case 'vector':
				vx = value.x.toFixed(this.options.decimals);
				vy = value.y.toFixed(this.options.decimals);
				infoString = `(${vx}, ${vy})`;
				break;
			default: infoString = value.toString();
		}
		this.input.value = infoString;
	}
}

export class ColorController extends Controller {
	constructor(title, value, opts) {
		super('color', title);
		// this.value = value;
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			onchange: function () {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
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

	listener(e) {
		this.value = this.input.value;
		// console.log(`Setting ${this.title}: ${this.value}`);
		this.options.onchange(this.value);
	}
}

export class Pane {
	constructor(container, opts) {
		// Set default options
		this.options = defaults(opts, {});
		this.bins = [];
		this.width = 256;
		this.node = document.createElement('div');
		this.node.classList.add('gui-pane');

		container.appendChild(this.node);
	}

	addBin(bin) {
		this.bins.push(bin);
		this.node.appendChild(bin.node);
	}
}
