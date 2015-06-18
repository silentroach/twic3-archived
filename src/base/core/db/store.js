import DBIndex from './idx';
import { promisify } from './request';

export default class DBStore {
	constructor(store) {
		this.store = store;
	}

	getIndex(indexName) {
		return new DBIndex(this.store.index(indexName));
	}

	getById(id) {
		return promisify(this.store.get(id));
	}

	deleteById(id) {
		return promisify(this.store.delete(id));
	}

	put(data) {
		return promisify(this.store.put(data));
	}
}
