import Model from './model';

export default class ModelJSON extends Model {
	static getJSONMap() {
		return { };
	}

	parse(json) {
		var map = this.constructor.getJSONMap();
		var model = this;

		if (!json) {
			throw new Error('invalid json data object');
		}

		Object.keys(map).forEach(function(jsonField) {
			var config = map[jsonField];
			var jsonData = json[jsonField];
			var result = { };
			var field;

			if (!(config instanceof Function)) {
				result[config] = jsonData;
			} else {
				result = config(jsonData);
			}

			for (field of Object.keys(result)) {
				let value = result[field];

				if (undefined === model[field]) {
					Object.defineProperty(model, field, {
						value: value,
						writable: false,
						configurable: false,
						enumerable: true
					});

					model.markAsChanged();
				} else
				if (model[field] !== value) {
					model[field] = value;

					model.markAsChanged();
				}
			}
		});
	}
}
