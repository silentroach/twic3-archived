export default class EventEmitter {
	constructor() {
		this.events = { };
	}

	on(type, listener) {
		if ('function' !== typeof listener) {
			throw new TypeError()
		}

		var listeners = this.events[type] || (this.events[type] = []);
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
			delete this.events[type];
		}

		var listener = args[0];
		if ('function' !== typeof listener) {
			throw new TypeError();
		}

		var listeners = this.events[type];
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
		var listeners = this.events[type];
		if (!listeners || !listeners.length) {
			return false;
		}

		listeners.forEach(callback => callback.apply(null, args));
		return true;
	}
}
