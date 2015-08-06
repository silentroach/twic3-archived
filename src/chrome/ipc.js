import { ActionTypes, Dispatcher } from 'app/ipc';

class DispatcherBackend {
	constructor() {
		this.handlerInitialized = false;
	}

	send(actionType, payload) {
		return new Promise(resolve => {
			chrome.runtime.sendMessage({
				type: actionType,
				data: payload
			}, function(reply) {
				resolve(reply);
			});
		});
	}

	on(actionType, handler) {
		if (!this.handlerInitialized) {
			this.handlerInitialized = true;

			chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));
		}
	}

	handleMessage(info) {

	}
}

const dispatcher = new Dispatcher(
	new DispatcherBackend()
);

export { ActionTypes, dispatcher };
