const VERSION = 1;
const NAME = 'twic';

const MODE_READ_WRITE = 'readwrite';
const MODE_READ_ONLY = 'readonly';

function upgrade(event) {
	const db = event.target.result;
	let objectStore;

	if (event.oldVersion < 1) {
		console.log('updating database to version 1');

		objectStore = db.createObjectStore('users', { keyPath: 'id' });
		objectStore.createIndex('screenName', 'screenNameNormalized', { unique: true });

		objectStore = db.createObjectStore('tweets', { keyPath: 'id' });
		objectStore.createIndex('timeline', 'timelineUserIds', { unique: false, multiEntry: true });
		objectStore.createIndex('mention', 'mentionUserId', { unique: false, multiEntry: true });

		objectStore = db.createObjectStore('friendship', { keyPath: 'ids' });
		objectStore.createIndex('userId', 'userId', { unique: false });
	}
}

const DB_FIELD = Symbol('db');

export default class DB {
	constructor() {
		this[DB_FIELD] = null;
	}

	getDB() {
		var self = this;

		return new Promise(function(resolve, reject) {
			var request;

			if (self[DB_FIELD]) {
				resolve(self[DB_FIELD]);
			} else {
				request = indexedDB.open(NAME, VERSION);
				request.onupgradeneeded = upgrade;
				request.onsuccess = function(event) {
					self[DB_FIELD] = request.result;
					resolve(self[DB_FIELD]);
				};
				request.onerror = reject;
			}
		});
	}

	getObjectStore(collectionName, mode) {
		return this.getDB()
			.then(function(db) {
				return db.transaction(collectionName, mode)
					.objectStore(collectionName);
			});
	}

	delete(collectionName, id) {
		return this.getObjectStore(collectionName, MODE_READ_WRITE)
			.then(function(store) {
				return new Promise(function(resolve, reject) {
					var request = store.delete(id);

					request.onerror = function(event) {
						reject(event);
					};

					request.onsuccess = function(event) {
						resolve();
					};
				});
			});
	}

	put(collectionName, object) {
		return this.getObjectStore(collectionName, MODE_READ_WRITE)
			.then(function(store) {
				return new Promise(function(resolve, reject) {
					var request = store.put(object);

					request.onerror = function(event) {
						reject(event);
					};

					request.onsuccess = function(event) {
						resolve();
					};
				});
			});
	}

	getIndex(collectionName, indexName, mode = MODE_READ_ONLY) {
		return this.getObjectStore(collectionName, mode)
			.then(function(store) {
				return store.index(indexName);
			});
	}

	// @todo rethink
	updateByCursor(collectionName, indexName, range, callback) {
		return this.getObjectStore(collectionName, MODE_READ_WRITE)
			.then(function(store) {
				return new Promise(function(resolve, reject) {
					const idx = store.index(indexName);
					const request = idx.openKeyCursor(range);

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

	getByIndex(collectionName, indexName, value) {
		return this.getIndex(collectionName, indexName)
			.then(function(idx) {
				return new Promise(function(resolve, reject) {
					const request = idx.get(value);

					request.onerror = function(event) {
						reject(event);
					};

					request.onsuccess = function(event) {
						resolve(request.result);
					};
				});
			});
	}

	getById(collectionName, id) {
		return this.getObjectStore(collectionName, MODE_READ_ONLY)
			.then(function(store) {
				return new Promise(function(resolve, reject) {
					var request = store.get(id);

					request.onerror = function(event) {
						reject(event);
					};

					request.onsuccess = function(event) {
						resolve(request.result);
					};
				});
			});
	}
}
