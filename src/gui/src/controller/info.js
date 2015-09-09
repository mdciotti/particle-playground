import defaults from 'defaults';
import Controller from './controller.js';

export default class InfoController extends Controller {
	constructor(title, getter, opts) {
		super('info', title);
		this.height = 48;
		this.getter = getter;

		// Set default options
		this.options = defaults(opts, {
			interval: 100,
			decimals: 2,
			format: 'auto'
		});

		let label = document.createElement('label');

		let name = document.createElement('span');
		name.classList.add('bin-item-name');
		name.innerText = title;
		label.appendChild(name);

		this.input = document.createElement('input');
		this.input.classList.add('bin-item-value');
		this.input.type = 'text';
		this.input.value = getter();
		this.input.disabled = true;
		label.appendChild(this.input);

		this.node.appendChild(label);

		this.watch();
	}

	watch() {
		setTimeout(this.watch.bind(this), this.options.interval);
		this.setInfo(this.getter());
	}

	setInfo(value) {
		let infoString, vx, vy;

		switch(this.options.format) {
			case 'text': infoString = value; break;
			case 'boolean': infoString = value ? 'True' : 'False'; break;
			case 'number': infoString = value.toFixed(this.options.decimals); break;
			case 'vector':
				vx = value.x.toFixed(this.options.decimals);
				vy = value.y.toFixed(this.options.decimals);
				infoString = `(${vx}, ${vy})`;
				break;
			default: infoString = value.toString();
		}
		this.input.value = infoString;
	}
}
