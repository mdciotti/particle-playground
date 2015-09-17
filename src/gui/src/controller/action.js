import defaults from 'defaults';
import Controller from './controller.js';

export default class ActionController extends Controller {
	constructor(title, opts) {
		super('action', title);
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			icon: 'ion-ios-arrow-thin-right',
			action: function (e) {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
		name.classList.add('bin-item-name');
		name.textContent = title;
		label.appendChild(name);

		let container = document.createElement('div');
		container.classList.add('bin-item-value');

		this.input = document.createElement('button');
		container.appendChild(this.input);

		let icon = document.createElement('i');
		icon.classList.add(this.options.icon);
		container.appendChild(icon);

		label.appendChild(container);
		this.node.appendChild(label);

		this.input.addEventListener('click', this.listener.bind(this));
	}

	listener(e) {
		// console.log(`Running ${this.title}`);
		this.options.action(e);
	}
}
