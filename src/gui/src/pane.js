import defaults from 'defaults';

export default class Pane {
	constructor(container, opts) {
		// Set default options
		this.options = defaults(opts, {
			width: 288,
			position: 'right',
			overlay: false
		});
		this.tabs = [];
		this.currentTab = 0;
		this.width = this.options.width;
		this.totalWidth = 0;
		this.node = document.createElement('div');
		this.node.classList.add('gui-pane');
		if (this.options.overlay) { this.node.classList.add('overlay'); }
		this.setStyleWidth();

		this.tabbar = document.createElement('div');
		this.tabbar.classList.add('gui-tab-bar');
		this.node.appendChild(this.tabbar);

		this.tabview = document.createElement('div');
		this.tabview.classList.add('gui-tab-view');
		this.node.appendChild(this.tabview);

		container.appendChild(this.node);
	}

	setStyleWidth() {
		this.node.style.width = `${this.width}px`;
	}

	setTab(i) {
		if (0 <= i && i < this.tabs.length) {
			this.currentTab = i;
			this.tabview.style.transform = `translateX(-${i * this.width}px)`;
			let tabButtons = this.tabbar.querySelectorAll('.gui-tab-bar-button');
			Array.prototype.forEach.call(tabButtons, e => {
				e.classList.remove('selected');
			});
		}
	}

	addTab(tab) {
		let i = this.tabs.push(tab) - 1;
		this.tabview.appendChild(tab.node);
		tab.parentPane = this;
		tab.node.style.width = `${this.width}px`;
		this.totalWidth += this.width;
		this.tabview.style.width = `${this.totalWidth}px`;

		// Create tab button
		let tabButton = document.createElement('div');
		tabButton.classList.add('gui-tab-bar-button');
		if (i === 0) { tabButton.classList.add('selected'); }
		if (tab.options.icon.length > 0) {
			let icon = document.createElement('i');
			icon.classList.add(tab.options.icon);
			tabButton.appendChild(icon);
			tabButton.title = tab.title;
		} else {
			let title = document.createElement('span');
			title.textContent = tab.title;
			tabButton.appendChild(title);
		}
		tabButton.addEventListener('click', e => {
			this.setTab(i);
			tabButton.classList.add('selected');
		});
		this.tabbar.appendChild(tabButton);
		// tab.init();
	}

	addTabs(...tabs) {
		tabs.forEach(this.addTab);
	}

	disableAll() {
		// this.tabs.forEach(tab => { tab.disable(); });
		this.tabs[this.currentTab].disableAll();
	}
}
