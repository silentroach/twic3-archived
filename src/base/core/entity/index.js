const INDICES_FIELD = Symbol('indices');

export default class Entity {
	constructor(indices) {
		this[INDICES_FIELD] = indices;
	}

	get indices() {
		return this[INDICES_FIELD];
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
