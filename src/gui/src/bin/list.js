import Bin from './bin.js';
import defaults from 'defaults';

export default class ListBin extends Bin {
	constructor(title, opts) {
		super(title, opts);
		this.type = 'list';
		this.itemSize = 48;
		this.options = defaults(opts, {
			open: true
		});
	}

	calculateHeight() {
		this.height = this.itemSize * this.controllers.length;
	}
}
