export default class MessageHandler {
	constructor(app) {
		this.app = app;
	}

	getMessageType() {
		throw new Error('no message id defined');
	}

	handle(messageData) {
		throw new Error('no message handler defined');
	}
}
