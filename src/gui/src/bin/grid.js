import Bin from './bin.js';
import defaults from 'defaults';

export default class GridBin extends Bin {
	constructor(title, opts) {
		super(title, opts);
		this.type = 'grid';
		this.options = defaults(opts, {
			selectable: false,
			minSelect: 1,
			maxSelect: 1,
			size: 48,
			onclick: function (e) {}
		});

		this.selectedItems = [];
		this.itemSize = this.options.size;
	}

	calculateHeight() {
		if (this.parentTab === null) { return; }
		let n = this.controllers.length;
		let cols = Math.floor(this.parentTab.parentPane.width / this.itemSize);
		this.height = this.itemSize * Math.ceil(n / cols);
	}

	addController(controller) {
		this.controllers.push(controller);
		this.container.appendChild(controller.node);
		controller.parentBin = this;
	}

	// Listener is called from a child listener
	listener(e) {
		this.options.onclick(e);
	}

	deselectAll() {
		this.controllers.forEach(c => { c.deselect(); } );
	}

	// Attempt to select the item
	selectItem(controller) {
		// If controller is not already in selectedItems
		if (this.selectedItems.indexOf(controller) < 0) {
			// Add controller to selection and select it
			this.selectedItems.push(controller);
			controller.select();
		}
		// Deselect last controller if new selection count is greater than maximum
		if (this.selectedItems.length > this.options.maxSelect) {
			// Attempt to deselect first item
			this.deselectItem(this.selectedItems[0]);
		}
	}

	// Attempt to deselect the item
	deselectItem(controller) {
		// Only deselect if current selection count is greater than minimum
		if (this.selectedItems.length > this.options.minSelect) {
			// Remove controller from selectedItems
			let index = this.selectedItems.indexOf(controller);
			this.selectedItems.splice(index, 1);
			// Deselect controller
			controller.deselect();
		}
	}
}
