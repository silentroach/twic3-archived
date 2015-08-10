const IS_CHANGED_FIELD = Symbol('changed');
const UPDATE_TIME_FIELD_NAME = 'updateTime';

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
		this[UPDATE_TIME_FIELD_NAME] = Date.now();
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

		return db.getStore(collectionName)
			.then(store => store.put(storeObject))
			.then(() => object);
	}

	isOutdated() {
		return undefined === this[UPDATE_TIME_FIELD_NAME]
			|| Date.now() - this[UPDATE_TIME_FIELD_NAME] > this.getFreshTime();
	}

	static deleteById(db, id) {
		return db.getStore(this.getCollectionName())
			.then(store => store.deleteById(id));
	}

	static getByIndex(db, index, value) {
		const ClassRef = this;

		return db.getStore(ClassRef.getCollectionName())
			.then(function(store) {
				return store
					.getIndex(index)
					.getByValue(value);
			})
			.then(function(data) {
				let obj;

				if (data) {
					obj = new ClassRef();
					fillData.call(obj, data);
				}

				return obj;
			});
	}

	static getById(db, id) {
		const ClassRef = this;

		return db.getStore(ClassRef.getCollectionName())
			.then(function(store) {
				return store.getById(id);
			})
			.then(function(data) {
				let obj;

				if (data) {
					obj = new ClassRef();
					fillData.call(obj, data);
				}

				return obj;
			});
	}
}
