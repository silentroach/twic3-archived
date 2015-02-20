import Model from './model';

export default class ModelJSON extends Model {
	static getJSONMap() {
		return { };
	}

	parse(json) {
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

				model.markAsChanged();
			} else
			if (model[field] !== result) {
				model[field] = result;

				model.markAsChanged();
			}
		});
	}
}
