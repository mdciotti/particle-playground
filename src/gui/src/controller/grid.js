import defaults from 'defaults';
import Controller from './controller.js';

export default class GridController extends Controller {
	constructor(title, opts) {
		super('grid', title);

		// Set default options
		this.options = defaults(opts, {
			type: 'select',
			disabled: false,
			selected: false,
			state: 0,
			states: [],
			onclick: function (e) {}
		});

		this.iconNode = document.createElement('i');

		this.state = this.options.state;
		this.enabled = !this.options.disabled;
		if (!this.enabled) { this.node.classList.add('disabled'); }
		this.setCurrent(this.options.state);

		this.node.appendChild(this.iconNode);
		this.node.addEventListener('click', this.listener.bind(this));

		// this.selectedIndex = 0;
		// this.multiSelection = [];
	}

	init() {
		if (this.options.selected) { this.parent.selectItem(this); }
	}

	setCurrent(state) {
		this.state = state;
		this.current = defaults(this.options.states[state], {
			tooltip: '',
			icon: '',
			onclick: function (e) {}
		});

		this.node.title = this.current.tooltip;
		if (this.current.icon.length > 0) {
			this.iconNode.className = this.current.icon;
			this.iconNode.textContent = '';
		} else if (this.options.shortcut.length > 0) {
			this.iconNode.textContent = this.options.shortcut.toUpperCase().charAt(0);
			this.iconNode.className = '';
		}
	}

	listener(e) {
		if (!this.enabled) { return; }
		this.current.onclick(e);
		this.options.onclick(e);

		// Move to next state
		let index = (this.state + 1) % this.options.states.length;
		this.setCurrent(index);

		// Handle selection
		if (this.parent.options.selectable) {
			this.toggle();
		}

		// Send event to parent
		this.parent.listener(e);
	}

	select() {
		this.selected = true;
		this.node.classList.add('selected');
	}

	deselect() {
		this.selected = false;
		this.node.classList.remove('selected');
	}

	toggle() {
		if (!this.selected) { this.parent.selectItem(this); }
		else { this.parent.deselectItem(this); }
	}
}
