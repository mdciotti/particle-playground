import defaults from 'defaults';
import Controller from './controller.js';

export default class ColorController extends Controller {
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
