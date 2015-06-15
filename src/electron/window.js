import BrowserWindow from 'browser-window';

import objectMerge from 'lodash.merge';

import eventEmitter from 'core/eventEmitter';

const instanceField = Symbol('instance');

export default class Window extends eventEmitter {
	constructor(url, settings) {
		super();

		const options = objectMerge({
			// maybe something later
		}, settings);

		const windowSettings = {
			show: false,
			'web-preferences': {
				javascript: true,
				// ---
				java: false,
				webgl: false,
				plugins: false,
				webaudio: false,
				'experimental-features': false,
				'experimental-canvas-features': false
			}
		};

		['width', 'height'].forEach(propName => windowSettings[propName] = options[propName]);

		this[instanceField] = new BrowserWindow(windowSettings);
		this[instanceField].on('closed', () => {
			this[instanceField] = null;
			this.emit('closed');
		});

		this[instanceField].loadUrl(url);

		if (options.visible) {
			this[instanceField].webContents.on('did-finish-load', () => this.show());
		}
	}

	show() {
		this[instanceField].show();
	}

	close() {
		this[instanceField].close();
	}

	openDevTools() {
		this[instanceField].openDevTools({
			detach: true
		});
	}
}
