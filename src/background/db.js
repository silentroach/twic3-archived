const VERSION = 1;
const NAME = 'twic';

const MODE_READ_WRITE = 'readwrite';
const MODE_READ_ONLY = 'readonly';

function upgrade(event) {
	var db = event.target.result;
	var store;

	if (event.newVersion < 2) {
		db.createObjectStore('users', { keyPath: 'id' });
		db.createObjectStore('tweets', { keyPath: 'id' });
		db.createObjectStore('timeline', { autoincrement: true });
		db.createObjectStore('mentions', { autoincrement: true });
	}
}

const dbField = Symbol('db');

export default class DB {
	constructor() {
		this[dbField] = null;
	}

	getDB() {
		var self = this;

		return new Promise(function(resolve, reject) {
			var request;

			if (self[dbField]) {
				resolve(self[dbField]);
			} else {
				request = indexedDB.open(NAME, VERSION);
				request.onupgradeneeded = upgrade;
				request.onsuccess = function(event) {
					self[dbField] = request.result;
					resolve(self[dbField]);
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
