import defaults from 'defaults';

export class Bin {
	constructor(title, opts) {
		this.title = title;
		this.type = 'generic';
		this.height = 0;
		this.container = null;
		this.controllers = [];
		this.node = null;
		this.node = document.createElement('div');
		this.node.classList.add('bin');
		this.pane = null;
		this.options = defaults(opts, {
			open: true
		});
		this.isOpen = this.options.open;

		let titlebar = document.createElement('div');
		titlebar.classList.add('bin-title-bar');
		titlebar.addEventListener('click', e => { this.toggle(); });

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
		this.node.appendChild(this.container);

		if (this.isOpen) { this.open(); }
		else { this.close(); }
	}

	init() {
		this.controllers.forEach(c => { c.init(); });
		this.calculateHeight();
		this.setStyleHeight();
		this.container.classList.add(`bin-${this.type}`);
	}

	open() {
		this.node.classList.add('open');
		// this.setStyleHeight(this.height);
		this.isOpen = true;
	}

	close() {
		this.node.classList.remove('open');
		// this.setStyleHeight(0);
		this.isOpen = false;
	}

	toggle() {
		if (this.isOpen) { this.close(); }
		else { this.open(); }
	}

	setStyleHeight() {
		this.container.style.height = `${this.height}px`;
	}

	calculateHeight() {
		this.height = this.controllers.reduce((sum, c) => {
			return sum + c.height;
		}, 0);
	}

	addController(controller) {
		this.controllers.push(controller);
		this.container.appendChild(controller.node);
		controller.parent = this;
		// this.height += controller.height;
		this.calculateHeight();
		this.setStyleHeight();
	}

	addControllers(...controllers) {
		controllers.forEach(this.addController.bind(this));
	}

	removeController(controller) {
		this.height -= controller.height;
		controller.destroy();
		this.setStyleHeight();
		let i = this.controllers.indexOf(controller);
		delete this.controllers[i];
		// this.controllers.splice(i, 1);
	}

	removeAllControllers() {
		this.controllers.forEach(this.removeController.bind(this));
		this.controllers.length = 0;
	}

	disable() {
		this.controllers.forEach(controller => { controller.disable(); });
	}
}

export class GridBin extends Bin {
	constructor(title, opts) {
		super(title, opts);
		this.type = 'grid';
		this.options = defaults(opts, {
			selectable: false,
			minSelect: 1,
			maxSelect: 1,
			size: 48,
			onclick: function (e) {}
		});

		this.selectedItems = [];
		this.itemSize = this.options.size;
	}

	calculateHeight() {
		this.pane.x;
		if (this.pane === null) { return; }
		let n = this.controllers.length;
		let cols = Math.floor(this.pane.width / this.itemSize);
		this.height = this.itemSize * Math.ceil(n / cols);
	}

	addController(controller) {
		this.controllers.push(controller);
		this.container.appendChild(controller.node);
		controller.parent = this;
	}

	// Listener is called from a child listener
	listener(e) {
		this.options.onclick(e);
	}

	deselectAll() {
		this.controllers.forEach(c => { c.deselect(); } );
	}

	// Attempt to select the item
	selectItem(controller) {
		// If controller is not already in selectedItems
		if (this.selectedItems.indexOf(controller) < 0) {
			// Add controller to selection and select it
			this.selectedItems.push(controller);
			controller.select();
		}
		// Deselect last controller if new selection count is greater than maximum
		if (this.selectedItems.length > this.options.maxSelect) {
			// Attempt to deselect first item
			this.deselectItem(this.selectedItems[0]);
		}
	}

	// Attempt to deselect the item
	deselectItem(controller) {
		// Only deselect if current selection count is greater than minimum
		if (this.selectedItems.length > this.options.minSelect) {
			// Remove controller from selectedItems
			let index = this.selectedItems.indexOf(controller);
			this.selectedItems.splice(index, 1);
			// Deselect controller
			controller.deselect();
		}
	}
}

export class ListBin extends Bin {
	constructor(title, opts) {
		super(title, opts);
		this.type = 'list';
		this.itemSize = 48;
		this.options = defaults(opts, {
			open: true
		});
	}

	calculateHeight() {
		this.height = this.itemSize * this.controllers.length;
	}
}
