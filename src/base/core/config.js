import EventEmitter from 'twic-eventemitter';

const BACKEND_FIELD = Symbol('backend');
const CHANGE_EVENT = 'change';

const emitChangesField = Symbol('emitChanges');

export default class Config extends EventEmitter {
	constructor(backend) {
		super();

		this[BACKEND_FIELD] = backend;

		backend.on('change', changes => this[emitChangesField].call(this, changes));
	}

	[emitChangesField](changes) {
		for (let key of Object.keys(changes)) {
			this.emit(
				[CHANGE_EVENT, key].join('.'),
				changes[key]
			);
		}

		this.emit(CHANGE_EVENT);
	}

	get(key) {
		return this[BACKEND_FIELD].get(key);
	}

	set(key, value) {
		return this[BACKEND_FIELD]
			.set(key, value)
			.then(() => {
				this[emitChangesField].call(this, {
					[key]: value
				});

				return value;
			});
	}
}
