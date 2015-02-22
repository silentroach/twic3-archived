const EVENTS_FIELD = Symbol('events');

export default class EventEmitter {
	constructor() {
		this[EVENTS_FIELD] = { };
	}

	on(type, listener) {
		if ('function' !== typeof listener) {
			throw new TypeError();
		}

		var listeners = this[EVENTS_FIELD][type] || (this[EVENTS_FIELD][type] = []);
		if (listeners.indexOf(listener) >= 0) {
			return this;
		}

		listeners.push(listener);
		return this;
	}

	once(type, listener) {
		var emitter = this;

		function callback() {
			emitter.off(type, callback);
			listener.apply(null, arguments);
		}

		return this.on(type, callback);
	}

	off(type, ...args) {
		if (0 === args.length) {
			delete this[EVENTS_FIELD][type];
		}

		var listener = args[0];
		if ('function' !== typeof listener) {
			throw new TypeError();
		}

		var listeners = this[EVENTS_FIELD][type];
		if (!listeners || !listeners.length) {
			return this;
		}

		var listenerIdx = listeners.indexOf(listener);
		if (listenerIdx < 0) {
			return this;
		}

		listeners.splice(listenerIdx, 1);
		return this;
	}

	emit(type, ...args) {
		var listeners = this[EVENTS_FIELD][type];
		if (!listeners || !listeners.length) {
			return false;
		}

		listeners.forEach(callback => callback.apply(null, args));
		return true;
	}
}
