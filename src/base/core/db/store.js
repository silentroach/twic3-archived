import DBIndex from './idx';

export default class DBStore {
	constructor(store) {
		this.store = store;
	}

	getIndex(indexName) {
		return new DBIndex(this.store.index(indexName));
	}

	getById(id) {
		const request = this.store.get(id);

		return new Promise(function(resolve, reject) {
			request.onerror = function(error) {
				reject(error);
			};

			request.onsuccess = function() {
				resolve(request.result);
			};
		});
	}

	deleteById(id) {
		const request = this.store.delete(id);

		return new Promise(function(resolve, reject) {
			request.onerror = function(error) {
				reject(error);
			};

			request.onsuccess = function() {
				resolve();
			};
		});
	}

	put(data) {
		const request = this.store.put(data);

		return new Promise(function(resolve, reject) {
			request.onerror = function(error) {
				reject(error);
			};

			request.onsuccess = function() {
				resolve();
			};
		});
	}
}
