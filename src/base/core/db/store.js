import DBIndex from './idx';
import { promisify } from './request';

const storeField = Symbol('store');

export default class DBStore {
	constructor(store) {
		this[storeField] = store;
	}

	getIndex(indexName) {
		return new DBIndex(this[storeField].index(indexName));
	}

	getById(id) {
		return promisify(this[storeField].get(id));
	}

	deleteById(id) {
		return promisify(this[storeField].delete(id));
	}

	put(data) {
		return promisify(this[storeField].put(data))
			.then(function() {
				return data;
			});
	}
}
