import Bin from './bin.js';
import defaults from 'defaults';

export default class CollectionBin extends Bin {
	constructor(title, opts) {
		opts = defaults(opts, {
			setControllers: function () {},
			onprevious: function () {},
			onnext: function () {},
			onclick: function (e) {}
		});
		super(title, opts);
		this.type = 'collection';
		this.collection = [];
		this.selectedIndex = 0;

		let controls = document.createElement('div');
		controls.classList.add('bin-nav');

		this.prevButton = document.createElement('div');
		this.prevButton.classList.add('bin-nav-button');
		controls.appendChild(this.prevButton);
		this.prevButton.addEventListener('click', this.previous.bind(this));

		let prev_icon = document.createElement('i');
		prev_icon.classList.add('ion-ios-arrow-back');
		this.prevButton.appendChild(prev_icon);

		this.info = document.createElement('div');
		this.info.classList.add('bin-nav-info');
		controls.appendChild(this.info);

		this.nextButton = document.createElement('div');
		this.nextButton.classList.add('bin-nav-button');
		controls.appendChild(this.nextButton);
		this.nextButton.addEventListener('click', this.next.bind(this));

		let next_icon = document.createElement('i');
		next_icon.classList.add('ion-ios-arrow-forward');
		this.nextButton.appendChild(next_icon);

		this.node.insertBefore(controls, this.container);

		this.setControlsState();
	}

	setControlsState() {
		if (this.collection.length > 0) {
			if (this.selectedIndex > 0) {
				this.prevButton.classList.remove('disabled');
			} else {
				this.prevButton.classList.add('disabled');
			}
			if (this.selectedIndex < this.collection.length - 1) {
				this.nextButton.classList.remove('disabled');
			} else {
				this.nextButton.classList.add('disabled');
			}
			this.info.textContent = `${this.selectedIndex + 1} of ${this.collection.length}`;
		} else {
			this.prevButton.classList.add('disabled');
			this.nextButton.classList.add('disabled');
			this.info.textContent = '(no items)';
		}
	}

	previous() {
		if (this.selectedIndex > 0) { this.selectedIndex -= 1; }
		this.setControllers();
		this.options.onprevious();
	}

	next() {
		if (this.selectedIndex < this.collection.length - 1) { this.selectedIndex += 1; }
		this.setControllers();
		this.options.onnext();
	}

	setControllers() {
		this.setControlsState();
		this.removeAllControllers();
		if (this.collection.length > 0) {
			if (this.selectedIndex >= this.collection.length) {
				this.selectedIndex = this.collection.length - 1;
			}
			this.options.setControllers(this.collection[this.selectedIndex]);
		} else {
			this.selectedIndex = 0;
		}
	}

	setCollection(collection) {
		this.collection = collection;
		this.setControllers();
	}
}
