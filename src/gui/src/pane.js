import defaults from 'defaults';

export default class Pane {
	constructor(container, opts) {
		// Set default options
		this.options = defaults(opts, {});
		this.bins = [];
		this.width = 288;
		this.node = document.createElement('div');
		this.node.classList.add('gui-pane');
		this.setStyleWidth();

		container.appendChild(this.node);
	}

	setStyleWidth() {
		this.node.style.width = `${this.width}px`;
	}

	addBin(bin) {
		this.bins.push(bin);
		this.node.appendChild(bin.node);
		bin.pane = this;
		bin.init();
	}

	addBins(...bins) {
		bins.forEach(this.addBin);
	}

	disableAll() {
		this.bins.forEach(bin => { bin.disable(); });
	}
}
