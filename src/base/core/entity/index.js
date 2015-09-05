const propIndices = Symbol('indices');

export default class Entity {
	constructor(indices) {
		this[propIndices] = indices;
	}

	get indices() {
		return this[propIndices];
	}

	render() {
		if ('production' !== process.env.NODE_ENV) {
			throw new Error('Entity render function undefined');
		}
	}

	getAdditionalData() {
		return null;
	}
}
