import DBIndex from './index';

const STORE_FIELD = Symbol('store');

export default class DBStore {
	constructor(store) {
		this[STORE_FIELD] = store;
	}

	getIndex(indexName) {
		return new DBIndex(this[STORE_FIELD].index(indexName));
	}

	getById(id) {
		const self = this;

		return new Promise(function(resolve, reject) {
			const request = self[STORE_FIELD].get(id);

			request.onerror = function(error) {
				reject(error);
			};

			request.onsuccess = function() {
				resolve(request.result);
			};
		});
	}

	deleteById(id) {
		const self = this;

		return new Promise(function(resolve, reject) {
			const request = self[STORE_FIELD].delete(id);

			request.onerror = function(error) {
				reject(error);
			};

			request.onsuccess = function() {
				resolve();
			};
		});
	}

	put(data) {
		const self = this;

		return new Promise(function(resolve, reject) {
			const request = self[STORE_FIELD].put(data);

			request.onerror = function(error) {
				reject(error);
			};

			request.onsuccess = function() {
				resolve();
			};
		});
	}
}
