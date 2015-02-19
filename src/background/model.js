const isChanged = Symbol('changed');

const updateTimeField = 'updateTime';

export default class Model {
	constructor() {
		this[isChanged] = false;
	}

	static getJSONMap() {
		return { };
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

	save(db) {
		var collectionName;
		var storeObject;

		if (!this[isChanged]) {
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

	parseFromJSON(json) {
		var map = this.constructor.getJSONMap();
		var model = this;
		var updateTime;

		if (!json) {
			throw new Error('invalid json data object');
		}

		Object.keys(map).forEach(function(jsonField) {
			var config = map[jsonField];
			var jsonData = json[jsonField];
			var field;

			if (Array.isArray(config)) {
				field = config[0];
				result = config[1](jsonData);
			} else {
				field = config;
				result = jsonData;
			}

			if (undefined === model[field]) {
				Object.defineProperty(model, field, {
					value: result,
					writable: false,
					configurable: false,
					enumerable: true
				});

				model[isChanged] = true;
			} else
			if (model[field] !== result) {
				model[field] = result;

				model[isChanged] = true;
			}
		});

		if (model[isChanged]
			|| undefined === model[updateTimeField]
		) {
			model[updateTimeField] = Date.now();
		}
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
