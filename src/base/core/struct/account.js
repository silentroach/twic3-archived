import Struct from './';
import Token from './token';

const userIdField = Symbol('userId');
const tokenField = Symbol('token');

export default class Account extends Struct {
	constructor(userId, token = null) {
		super();

		this[userIdField] = userId;
		this[tokenField] = token;
	}

	get userId() {
		return this[userIdField];
	}

	get token() {
		return this[tokenField];
	}

	set token(token) {
		this[tokenField] = token;
		this.emit('change');
	}

	isAuthorized() {
		return null !== this.token;
	}

	unauthorize() {
		this.token = null;
	}

	serialize() {
		if (!this.token) {
			return this.userId;
		}

		return [this.userId, this.token.serialize()];
	}

	unserialize(data) {
		if (Array.isArray(data)) {
			this[userIdField] = data[0];
			this[tokenField] = Token.unserialize(data[1]);
		} else {
			this[userIdField] = data;
		}
	}
}
