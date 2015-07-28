import EventEmitter from 'core/eventEmitter';

const xhrField = Symbol('xhr');

export default class Response extends EventEmitter {
	constructor(xhr) {
		super();

		this[xhrField] = xhr;
	}

	get status() {
		return this[xhrField].status;
	}

	get body() {
		return this[xhrField].response;
	}
}
