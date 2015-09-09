import defaults from 'defaults';
import Controller from './controller.js';

export default class ToggleController extends Controller {
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

		this.input = document.createElement('input');
		this.input.classList.add('bin-item-value', 'icon');
		this.input.type = 'checkbox';
		this.input.checked = this.value;
		label.appendChild(this.input);

		this.node.appendChild(label);

		this.input.addEventListener('change', this.listener.bind(this));
	}

	listener(e) {
		this.value = e.target.checked;
		// console.log(`Toggling ${this.title}: ${this.value ? 'on' : 'off'}`);
		this.options.onchange(this.value);
	}
}
