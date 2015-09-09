import defaults from 'defaults';
import Controller from './controller.js';

export default class HTMLController extends Controller {
	constructor(title, opts) {
		super('html', title);
		this.options = defaults(opts, {
			editable: false
		});

		// TODO: how to determine the height dynamically?
		this.height = 176;
		if (!this.options.editable) { this.disable(); }
		else { this.node.contentEditable = true; }
	}

	// init() {
	// 	this.disable();
	// }

	getHTML() { return this.node.innerHTML; }
	setHTML(content) { this.node.innerHTML = content; }
	// append(text) {}
}
