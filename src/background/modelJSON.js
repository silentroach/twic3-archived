import Model from './model';

function prepareValue(value, type) {
	if (null === value
		|| undefined === value
	) {
		return undefined;
	}
}

export default class ModelJSON extends Model {
	static getJSONMap() {
		return { };
	}

	static getParser() {
		throw new Error('No parser defined');
	}

	parse(json) {
		var data = this.constructor.getParser().process(json);

		for (let field of Object.keys(data)) {
			let value = data[field];

			if (null === value
				|| undefined === value
			) {
				if (undefined !== this[field]) {
					delete this[field];
					this.markAsChanged();
				}
			} else
			if (undefined === this[field]) {
				Object.defineProperty(this, field, {
					value: value,
					writable: false,
					configurable: false,
					enumerable: true
				});

				this.markAsChanged();
			} else
			if (this[field] !== value) {
				this[field] = value;

				this.markAsChanged();
			}
		}
	}
}
