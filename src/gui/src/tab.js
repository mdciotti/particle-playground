import defaults from 'defaults';

export default class Tab {
	constructor(title, opts) {
		// Set default options
		this.options = defaults(opts, {
			icon: ''
		});
		this.title = title;
		this.bins = [];
		this.node = document.createElement('div');
		this.node.classList.add('gui-tab');
	}

	addBin(bin) {
		this.bins.push(bin);
		this.node.appendChild(bin.node);
		bin.parentTab = this;
		bin.init();
	}

	addBins(...bins) {
		bins.forEach(this.addBin);
	}

	disableAll() {
		this.bins.forEach(bin => { bin.disable(); });
	}
}
