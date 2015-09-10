import defaults from 'defaults';
import Controller from './controller.js';

export default class TextController extends Controller {
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
		name.textContent = title;
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
