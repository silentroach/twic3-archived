import Struct from './';

const tokenField = Symbol('token');
const secretField = Symbol('secret');

export default class Token extends Struct {
	constructor(token, secret) {
		super();

		this.unserialize([token, secret]);
	}

	get token() {
		return this[tokenField];
	}

	get secret() {
		return this[secretField];
	}

	serialize() {
		return [this.token, this.secret];
	}

	unserialize(data) {
		if (!Array.isArray(data)
			|| 2 !== data.length
		) {
			console.error('invalid data', data);
			return;
		}

		this[tokenField] = data[0];
		this[secretField] = data[1];
	}
}
