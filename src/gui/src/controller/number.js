import defaults from 'defaults';
import Controller from './controller.js';

export default class NumberController extends Controller {
	constructor(title, value, opts) {
		super('number', title);
		this.value = value;
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			min: null,
			max: null,
			step: null,
			decimals: 3,
			onchange: function (val) {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
		name.classList.add('bin-item-name');
		name.textContent = title;
		label.appendChild(name);

		this.input = document.createElement('input');
		this.input.classList.add('bin-item-value');
		this.input.type = 'number';
		this.input.value = this.value;
		if (this.options.min !== null) { this.input.min = this.options.min; }
		if (this.options.max !== null) { this.input.max = this.options.max; }
		if (this.options.step !== null) { this.input.step = this.options.step; }
		label.appendChild(this.input);

		this.node.appendChild(label);

		this.input.addEventListener('change', this.listener.bind(this));
	}

	setValue(val) {
		this.value = val;
		this.input.value = this.value.toFixed(this.options.decimals);
	}

	listener(e) {
		this.value = e.target.value;
		// console.log(`Setting ${this.title}: ${this.value}`);
		this.options.onchange(parseFloat(this.value));
	}
}
