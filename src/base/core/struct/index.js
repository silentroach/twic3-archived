import EventEmitter from 'core/eventEmitter';

export default class Struct extends EventEmitter {
	serialize() {
		console.error('no [serialize] method defined');
	}

	unserialize(data) {
		console.error('no [unserialize] method defined');
	}

	static unserialize(data) {
		const instance = new this();

		instance.unserialize(data);

		return instance;
	}
}
