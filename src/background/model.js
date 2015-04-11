const IS_CHANGED_FIELD = Symbol('changed');

const updateTimeField = 'updateTime';

function fillData(data) {
	if (!data) {
		return null;
	}

	for (let key of Object.keys(data)) {
		Object.defineProperty(this, key, {
			value: data[key],
			writable: true,
			configurable: false,
			enumerable: true
		});
	}

	return this;
}

export default class Model {
	constructor() {
		this[IS_CHANGED_FIELD] = false;
	}

	static getCollectionName() {
		throw new Error('collection name is not defined');
	}

	getFreshTime() {
		return 60 * 60 * 24 * 7 * 1000;
	}

	getData() {
		const storeObject = { };

		for (let key of Object.keys(this)) {
			storeObject[key] = this[key];
		}

		return storeObject;
	}

	markAsChanged() {
		this[IS_CHANGED_FIELD] = true;
		this[updateTimeField] = Date.now();
	}

	isChanged() {
		return this[IS_CHANGED_FIELD];
	}

	save(db) {
		const object = this;
		const collectionName = this.constructor.getCollectionName();
		const storeObject = this.getData();

		if (!this.isChanged()) {
			return Promise.resolve();
		}

		console.log('saving to', collectionName, storeObject);

		return db.put(collectionName, storeObject)
			.then(function() {
				return object;
			});
	}

	isOutdated() {
		return undefined === this[updateTimeField]
			|| Date.now() - this[updateTimeField] > this.getFreshTime();
	}

	static getByIndex(db, index, value) {
		const obj = new this(); // @todo this, wtf?!

		return db.getByIndex(obj.constructor.getCollectionName(), index, value)
			.then(fillData.bind(obj));
	}

	static getById(db, id) {
		const obj = new this(); // @todo this, wtf?!

		return db.getById(obj.constructor.getCollectionName(), id)
			.then(fillData.bind(obj));
	}
}
