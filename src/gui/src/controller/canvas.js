import defaults from 'defaults';
import Controller from './controller.js';

export default class CanvasController extends Controller {
	constructor(title, opts) {
		super('canvas', title);
		this.height = 48;
		this.canvas = document.createElement('canvas');
		this.node.appendChild(this.canvas);
		this.ctx = null;
		this.disable();
	}

	init() {
		this.canvas.height = this.height;
		this.canvas.width = this.parentBin.parentTab.parentPane.width;
		this.ctx = this.canvas.getContext('2d');
	}
}
