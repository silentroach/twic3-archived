const isChanged = Symbol('changed');

const updateTimeField = 'updateTime';

export default class Model {
	constructor() {
		this[isChanged] = false;
	}

	static getCollectionName() {
		throw new Error('collection name is not defined');
	}

	getFreshTime() {
		return 60 * 60 * 24 * 7 * 1000;
	}

	getData() {
		var storeObject = { };

		for (let key of Object.keys(this)) {
			storeObject[key] = this[key];
		}

		return storeObject;
	}

	markAsChanged() {
		this[isChanged] = true;
		this[updateTimeField] = Date.now();
	}

	isChanged() {
		return this[isChanged];
	}

	save(db) {
		var collectionName;
		var storeObject;

		if (!this.isChanged()) {
			return Promise.resolve();
		}

		collectionName = this.constructor.getCollectionName();
		storeObject = this.getData();

		console.debug('saving to', collectionName, storeObject);

		return db.put(collectionName, storeObject);
	}

	isOutdated() {
		return undefined === this[updateTimeField]
			|| Date.now() - this[updateTimeField] > this.getFreshTime();
	}

	static getById(db, id) {
		var obj = new this;

		return db.getById(obj.constructor.getCollectionName(), id)
			.then(function(data) {
				var map;

				if (!data) {
					return null;
				}

				for (let key of Object.keys(data)) {
					Object.defineProperty(obj, key, {
						value: data[key],
						writable: true,
						configurable: false,
						enumerable: true
					});
				}

				return obj;
			});
	}
}
