import defaults from '../node_modules/defaults';
import vkey from '../node_modules/vkey';

// Webpack: load stylesheet
require('../assets/styles/modal-overlay.less');

export default class ModalOverlay {
	constructor(opts) {
		this.options = defaults(opts, {
			title: '',
			titleSize: 'medium',
			message: '',
			icon: 'none',
			iconType: 'font',
			actions: [
				{ text: 'Cancel', onclick: function (e) { this.destroy(); } },
				{ text: 'OK', 'key': '<return>', onclick: function (e) { this.destroy(); } }
			],
			scrollable: false,
			dismissable: true
		});

		this.el = document.createElement('div');
		this.el.classList.add('modal-overlay');

		this.keyListeners = {};
		window.addEventListener('keyup', this.keyListener.bind(this));

		if (this.options.dismissable) {
			this.el.addEventListener('click', e => {
				if (e.target === this.el) { this.destroy(); }
			});
			// this.keyListeners['<escape>'].push(this.destroy);
			this.addKeyListener('<escape>', this.destroy);
		}

		let $container, $content, $scrollView, $icon, $title, $message, $actions, $action;

		$container = document.createElement('div');
		$container.classList.add('container');

		$content = document.createElement('div');
		$content.classList.add('content');

		if (this.options.icon !== 'none') {
			if (this.options.iconType === 'font') {
				$icon = document.createElement('i');
				switch (this.options.icon) {
					case 'success': $icon.classList.add('ion-ios-checkmark-outline'); break;
					case 'warning': $icon.classList.add('ion-ios-minus-outline'); break;
					case 'error': $icon.classList.add('ion-ios-minus-outline'); break;
					case 'help': $icon.classList.add('ion-ios-help-outline'); break;
					case 'info': $icon.classList.add('ion-ios-information-outline'); break;
					default: $icon.classList.add(this.options.icon);
				}
			} else if (this.options.iconType === 'external') {
				$icon = document.createElement('img');
				$icon.src = this.options.icon;
			}
			$icon.classList.add('icon');
			$content.appendChild($icon);
		} else {
			$content.classList.add('no-icon');			
		}

		if (this.options.title.length > 0) {
			$title = document.createElement('h1');
			$title.classList.add(this.options.titleSize);
			$title.innerText = this.options.title;
			$content.appendChild($title);
		}

		if (this.options.message.length > 0) {
			$message = document.createElement('div');
			$message.classList.add('content-view');
			if (this.options.scrollable) {
				$message.classList.add('scrollable');
			}
			$message.innerHTML = this.options.message;
			$content.appendChild($message);
		}

		if (this.options.actions.length >= 0) {
			$actions = document.createElement('div');
			$actions.classList.add('actions');
			this.options.actions.forEach(action => {
				$action = document.createElement('a');
				if (action.soft) { $action.classList.add('soft'); }
				if (action.default) { $action.classList.add('default'); }
				$action.innerText = action.text;
				$action.addEventListener('click', action.onclick);
				$actions.appendChild($action);
				// Attach event listener
				if (action.hasOwnProperty('key')) {
					this.addKeyListener(action.key, action.onclick);
				}
			});
			$content.appendChild($actions)
		}

		$container.appendChild($content);
		this.el.appendChild($container);
	}

	appendTo(container) {
		container.appendChild(this.el);
	}

	addKeyListener(key, fn) {
		if (!this.keyListeners.hasOwnProperty(key)) {
			this.keyListeners[key] = [];
		}
		this.keyListeners[key].push(fn);
	}

	keyListener(e) {
		let key = vkey[e.keyCode];
		if (this.keyListeners.hasOwnProperty(key)) {
			this.keyListeners[key].forEach(fn => { fn(e); });
		}
	}

	destroy() {
		this.el.classList.add('hidden');
		// TODO: properly remove event listener (this isn't working...)
		window.removeEventListener('keyup', this.keyListener);

		setTimeout(() => {
			this.el.parentNode.removeChild(this.el);
		}, 1000);
	}
}
