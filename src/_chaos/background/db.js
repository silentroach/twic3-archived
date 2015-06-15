import CoreDB from 'core/db';

export default class DB extends CoreDB {
	/** @deprecated */ getObjectStore(collectionName, mode) {
		return this.getDB()
			.then(function(db) {
				return db.transaction(collectionName, mode)
					.objectStore(collectionName);
			});
	}

	getIndex(collectionName, indexName, mode = DB.MODE_READ_ONLY) {
		return this.getObjectStore(collectionName, mode)
			.then(function(store) {
				return store.index(indexName);
			});
	}

	// @todo rethink
	updateByCursor(collectionName, indexName, range, callback) {
		return this.getObjectStore(collectionName, DB.MODE_READ_WRITE)
			.then(function(store) {
				const request = store
					.index(indexName)
					.openKeyCursor(range);

				return new Promise(function(resolve, reject) {
					request.onerror = function(event) {
						reject(event);
					};

					request.onsuccess = function(event) {
						if (!request.result) {
							resolve();
						} else {
							callback(store, request.result);
						}
					};
				});
			});
	}
}
