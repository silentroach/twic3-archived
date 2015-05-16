import DBStore from './db/store';

// @todo move migrations to -> registerMigration (call from app)
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

	/** @private */ getDB() {
		const self = this;

		return new Promise(function(resolve, reject) {
			if (self[DB_FIELD]) {
				resolve(self[DB_FIELD]);
			} else {
				const request = indexedDB.open(DB.NAME, DB.VERSION);
				request.onupgradeneeded = upgrade;
				request.onsuccess = function(event) {
					self[DB_FIELD] = request.result;
					resolve(self[DB_FIELD]);
				};
				request.onerror = reject;
			}
		});
	}

	getStore(collectionName, mode) {
		return this.getDB()
			.then(function(db) {
				const objectStore = db
					.transaction(collectionName, mode)
					.objectStore(collectionName);

				return new DBStore(objectStore);
			});
	}

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

DB.VERSION = 1;
DB.NAME = 'twic';

DB.MODE_READ_WRITE = 'readwrite';
DB.MODE_READ_ONLY = 'readonly';
