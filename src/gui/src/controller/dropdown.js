import defaults from 'defaults';
import Controller from './controller.js';

export default class DropdownController extends Controller {
	constructor(title, items, opts) {
		super('dropdown', title);
		// this.value = value;
		this.height = 48;
		this.items = [];

		// Set default options
		this.options = defaults(opts, {
			onchange: function () {}
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
		name.classList.add('bin-item-name');
		name.textContent = title;
		label.appendChild(name);

		this.input = document.createElement('select');
		this.input.classList.add('bin-item-value');
		this.createItems(items);
		label.appendChild(this.input);

		this.node.appendChild(label);

		this.input.addEventListener('change', this.listener.bind(this));
	}

	createItems(list) {
		list.forEach(item => {
			if (!item.hasOwnProperty('name')) { item.name = '(unnamed)'; }
			item = defaults(item, {
				value: item.name,
				selected: false,
				disabled: false
			});
			this.items.push(item);

			if (item.hasOwnProperty('children')) {
				// TODO: handle grouped options
			}

			let option = document.createElement('option');
			option.value = item.value;
			option.textContent = item.name;
			if (item.selected) {
				option.selected = true;
				// this.value = item.value;
			}
			if (item.disabled) { option.disabled = true; }
			this.input.add(option);
		});
	}

	listener(e) {
		// this.value = this.input.value;
		this.options.onchange(this.input.value);
	}
}
