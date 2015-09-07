
// Webpack: load stylesheet
require('../assets/styles/modal-overlay.less');

export default class ModalOverlay {
	constructor(title, message, actions, type = 'info') {

		this.el = document.createElement('div');
		this.el.classList.add('modal-overlay');
		let $container, $content, $icon, $title, $message, $actions, $action;

		$container = document.createElement('div');
		$container.classList.add('container');

		$content = document.createElement('div');
		$content.classList.add('content');

		$icon = document.createElement('i');
		switch (type) {
			case 'success': $icon.classList.add('ion-ios-checkmark-outline'); break;
			case 'warning': $icon.classList.add('ion-ios-minus-outline'); break;
			case 'error': $icon.classList.add('ion-ios-minus-outline'); break;
			case 'help': $icon.classList.add('ion-ios-help-outline'); break;
			case 'info': $icon.classList.add('ion-ios-information-outline'); break;
			default: $icon.classList.add(type);
		}
		$content.appendChild($icon);

		$title = document.createElement('h1');
		$title.innerText = title;
		$content.appendChild($title);
		
		$message = document.createElement('p');
		$message.innerHTML = message;
		$content.appendChild($message);

		if (actions.length >= 0) {
			$actions = document.createElement('div');
			$actions.classList.add('actions');
			actions.forEach(action => {
				$action = document.createElement('a');
				if (action.soft) { $action.classList.add('soft'); }
				$action.innerText = action.text;
				$action.addEventListener('click', action.onclick);
				$actions.appendChild($action);
			});
			$content.appendChild($actions)
		}

		$container.appendChild($content);
		this.el.appendChild($container);
	}

	appendTo(container) {
		container.appendChild(this.el);
	}

	destroy() {
		this.el.classList.add('hidden');

		setTimeout(() => {
			this.el.parentNode.removeChild(this.el);
		}, 1000);
	}
}
