import EventEmitter from 'core/eventEmitter';

export default class Struct extends EventEmitter {
	serialize() {
		if ('production' !== process.env.NODE_ENV) {
			throw new Error('no [serialize] method defined');
		}
	}

	unserialize(data) {
		if ('production' !== process.env.NODE_ENV) {
			throw new Error('no [unserialize] method defined');
		}
	}

	static unserialize(data) {
		const instance = new this();

		instance.unserialize(data);

		return instance;
	}
}
