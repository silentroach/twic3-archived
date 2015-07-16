import DBStore from './store';

const instanceField = Symbol('instance');
const migrationsField = Symbol('migrations');
const versionField = Symbol('version');
const nameField = Symbol('name');

const upgradeField = Symbol('upgrade');
const getDBField = Symbol('getDB');

export const TransactionModes = {
	READ_WRITE: 'readwrite',
	READ_ONLY: 'readonly'
};

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

	[getDBField]() {
		if (this[instanceField]) {
			return this[instanceField];
		}

		this[instanceField] = new Promise((resolve, reject) => {
			const request = indexedDB.open(this[nameField], this[versionField]);
			request.onupgradeneeded = this[upgradeField].bind(this);
			request.onsuccess = (event) => resolve(request.result);
			request.onerror = reject;
		});

		return this[instanceField];
	}

	[upgradeField](event) {
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

	getStore(collectionName, mode = TransactionModes.READ_ONLY) {
		return this[getDBField]()
			.then(function(db) {
				const objectStore = db
					.transaction(collectionName, mode)
					.objectStore(collectionName);

				return new DBStore(objectStore);
			});
			// @todo wrap? -> .transaction can throw an error if collection doesn't exists
	}
}
