import defaults from 'defaults';

export default class Bin {
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
			open: true,
			showTitle: true
		});
		this.isOpen = this.options.open;

		let titlebar = document.createElement('div');
		titlebar.classList.add('bin-title-bar');
		if (!this.options.showTitle) { titlebar.classList.add('hidden'); }
		titlebar.addEventListener('click', e => { this.toggle(); });

		let icon = document.createElement('i');
		icon.classList.add('ion-ios-arrow-right');
		titlebar.appendChild(icon);

		let label = document.createElement('span');
		label.classList.add('bin-title');
		label.textContent = this.title;
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
		controller.parentBin = this;
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
