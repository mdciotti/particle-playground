export default class Controller {
	constructor(type, title) {
		this.title = title;
		this.type = type;
		this.node = document.createElement('div');
		this.node.classList.add('bin-item', 'controller', type);
		this.parent = null;
		this.height = 0;
		this.animator = null;
		this.enabled = false;
		// this.node.appendChild();
	}

	init() {

	}

	setValue(val) {
		this.value = val;
		if (this.hasOwnProperty('input')) { this.input.value = val; }
	}

	listener(e) {
		this.setValue(e.target.value);
		// console.log(`Setting ${this.title}: ${this.value}`);
		// this.options.onchange(this.value);
	}

	watch(getter) {
		this.getter = getter;
		this.disable();
		this.update();
		return this;
	}

	update() {
		this.animator = requestAnimationFrame(this.update.bind(this));
		this.setValue(this.getter());
	}

	unwatch() {
		cancelAnimationFrame(this.animator);
		this.enable();
	}

	rewatch() {
		this.disable();
		this.update();
	}

	disable() {
		this.enabled = false;
		this.node.classList.add('disabled');
		if (this.hasOwnProperty('input')) { this.input.disabled = true; }
	}

	enable() {
		this.enabled = true;
		this.node.classList.remove('disabled');
		if (this.hasOwnProperty('input')) { this.input.disabled = false; }
	}

	destroy() {
		// TODO: ensure proper destruction
		this.unwatch();
		this.node.parentNode.removeChild(this.node);
		this.node = null;
		this.parent = null;
		this.getter = null;
	}
}
