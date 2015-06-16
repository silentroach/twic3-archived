import DBStore from './store';

const instanceField = Symbol('instance');
const migrationsField = Symbol('migrations');
const versionField = Symbol('version');
const nameField = Symbol('name');

export default class DB {
	constructor(name) {
		this[instanceField] = null;
		this[migrationsField] = { };
		this[versionField] = 0;
		this[nameField] = name;
	}

	remove() {
		indexedDB.deleteDatabase(this[nameField]);
	}

	registerMigration(version, migration) {
		const migrations = this[migrationsField];

		if (undefined === migrations[version]) {
			migrations[version] = [];
		}

		migrations[version].push(migration);

		this[versionField] = Math.max(this[versionField], version);
	}

	getVersion() {
		return this[versionField];
	}

	/** @protected */ getDB() {
		const self = this;

		return new Promise(function(resolve, reject) {
			if (self[instanceField]) {
				resolve(self[instanceField]);
			} else {
				const request = indexedDB.open(self[nameField], self[versionField]);
				request.onupgradeneeded = self.upgrade.bind(self);
				request.onsuccess = function(event) {
					self[instanceField] = request.result;
					resolve(self[instanceField]);
				};
				request.onerror = reject;
			}
		});
	}

	/** @private */ upgrade(event) {
		const migrations = this[migrationsField];
		const instance = event.target.result;
		const currentVersion = event.oldVersion;
		const versions = Object
			.keys(migrations)
			.sort((a, b) => a - b);

		versions.forEach(version => {
			if (version > currentVersion) {
				console.log('updating database to version', version);

				migrations[version].forEach(migration => migration(instance));
			}
		});
	}

	getStore(collectionName, mode = DB.MODE_READ_ONLY) {
		return this.getDB()
			.then(function(db) {
				const objectStore = db
					.transaction(collectionName, mode)
					.objectStore(collectionName);

				return new DBStore(objectStore);
			});
	}
}

DB.MODE_READ_WRITE = 'readwrite';
DB.MODE_READ_ONLY = 'readonly';
