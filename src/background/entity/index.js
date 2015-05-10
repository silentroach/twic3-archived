const INDICES_FIELD = Symbol('indices');

export default class Entity {
	constructor(indices) {
		this[INDICES_FIELD] = indices;
	}

	get indices() {
		return this[INDICES_FIELD];
	}

	render() {
		console.error('entity render function undefined');
	}
}
