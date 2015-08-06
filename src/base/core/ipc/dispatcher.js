const backendField = Symbol('backend');
const handlersField = Symbol('handlers');
const handlerField = Symbol('handler');

export default class Dispatcher {
	constructor(backend) {
		this[backendField] = backend;
		this[handlersField] = { };
	}

	send(actionType, payload = null) {
		console.log('sending message', actionType, payload);

		const promise = this[backendField]
			.send(actionType, payload);

		if ('production' !== process.env.NODE_ENV) {
			promise.then(response => {
				console.log('responce received', response);

				return response;
			});
		}

		return promise;
	}

	on(actionType, handler) {
		if ('production' !== process.env.NODE_ENV
			&& undefined !== this[handlersField][actionType]
		) {
			throw new Error(actionType + ' handler is already defined');
		}

		this[handlersField][actionType] = handler;
		this[backendField].on(actionType, this[handlerField].bind(this));

		return this;
	}

	[handlerField](actionType, payload) {
		console.log('handler called', actionType, payload);
	}
}
