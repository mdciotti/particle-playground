import defaults from 'defaults';
import Controller from './controller.js';

export default class ToggleController extends Controller {
	constructor(title, value, opts) {
		super('toggle', title);
		this.value = value;
		this.height = 48;

		// Set default options
		this.options = defaults(opts, {
			icon_checked: 'ion-ios-checkmark-outline',
			icon_unchecked: 'ion-ios-circle-outline',
			onchange: function () {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
		name.classList.add('bin-item-name');
		name.textContent = title;
		label.appendChild(name);

		let container = document.createElement('div');
		container.classList.add('bin-item-value');

		this.input = document.createElement('input');
		this.input.type = 'checkbox';
		this.input.checked = this.value;
		container.appendChild(this.input);

		let icon_unchecked = document.createElement('i');
		icon_unchecked.classList.add(this.options.icon_unchecked, 'unchecked');
		container.appendChild(icon_unchecked);

		let icon_checked = document.createElement('i');
		icon_checked.classList.add(this.options.icon_checked, 'checked');
		container.appendChild(icon_checked);

		label.appendChild(container);
		this.node.appendChild(label);

		this.input.addEventListener('change', this.listener.bind(this));
	}

	listener(e) {
		this.value = e.target.checked;
		// console.log(`Toggling ${this.title}: ${this.value ? 'on' : 'off'}`);
		this.options.onchange(this.value);
	}
}
