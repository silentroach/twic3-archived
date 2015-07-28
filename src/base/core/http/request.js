const methodField = Symbol('method');
const urlField = Symbol('url');
const headersField = Symbol('headers');
const queryField = Symbol('query');
const typeField = Symbol('type');

export default class Request {
	constructor(method, url) {
		this[methodField] = method;
		this[urlField] = url;
		this[typeField] = 'text';

		this[headersField] = new Map();
		this[queryField] = new Map();
	}

	get headers() {
		return this[headersField];
	}

	get query() {
		return this[queryField];
	}

	get method() {
		return this[methodField];
	}

	get url() {
		return this[urlField];
	}

	get type() {
		return this[typeField];
	}

	set type(value) {
		this[typeField] = value;
	}
}
