const VERSION = 1;
const NAME = 'twic';

const MODE_READ_WRITE = 'readwrite';
const MODE_READ_ONLY = 'readonly';

function upgrade(event) {
	var db = event.target.result;
	var objectStore;

	if (event.oldVersion < 1) {
		objectStore = db.createObjectStore('users', { keyPath: 'id' });
		objectStore.createIndex('screenName', 'screenNameNormalized', { unique: true });

		db.createObjectStore('tweets', { keyPath: 'id' });
		db.createObjectStore('timeline', { autoincrement: true });
		db.createObjectStore('mentions', { autoincrement: true });
		db.createObjectStore('friendship', { keyPath: 'ids' });
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
