import Bin from './bin.js';
import defaults from 'defaults';

export default class CollectionBin extends Bin {
	constructor(title, opts) {
		super(title, opts);
		this.type = 'collection';
		this.options = defaults(opts, {
			onclick: function (e) {}
		});
	}
}
