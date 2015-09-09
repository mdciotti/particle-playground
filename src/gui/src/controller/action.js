import defaults from 'defaults';
import Controller from './controller.js';

export default class ActionController extends Controller {
	constructor(title, opts) {
		super('action', title);
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			action: function (e) {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
		name.classList.add('bin-item-name');
		name.innerText = title;
		label.appendChild(name);

		this.input = document.createElement('button');
		this.input.classList.add('bin-item-value', 'icon');
		// this.input.type = 'button';
		label.appendChild(this.input);

		this.node.appendChild(label);

		this.input.addEventListener('click', this.listener.bind(this));
	}

	listener(e) {
		// console.log(`Running ${this.title}`);
		this.options.action(e);
	}
}
