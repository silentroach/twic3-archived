const rulesField = Symbol('parser');

export const FieldTypes = {
	Undefined: 0,
	Int: 1,
	String: 2,
	Boolean: 3,
	Date: 4
};

function processRecord(fieldName, data, rules, object) {
	let result = { };
	let type;
	let name;
	let callback;

	// can by just a type or an array [type, callback] / [type, name]
	if ('number' === typeof rules) {
		type = rules;
	} else {
		[type, callback] = rules;
	}

	if ('function' !== typeof callback) {
		name = callback;
		callback = null;
	}

	if (!name) {
		name = fieldName;
	}

	if (null === data) {
		data = undefined;
	}

	if (undefined !== data) {
		switch (type) {
			case FieldTypes.Int:
				data = Number(data);
				if (Number.isNaN(data)) {
					data = undefined;
				}

				break;
			case FieldTypes.String:
				if ('string' === typeof data
					&& '' === data.trim()
				) {
					data = undefined;
				} else {
					data = String(data);
				}

				break;
			case FieldTypes.Boolean:
				data = Boolean(data);
				break;
			case FieldTypes.Date:
				data = new Date(data).getTime();
				break;
		}
	}

	// can be overwritten to undefined
	if (undefined !== data) {
		if (callback) {
			result = callback(data, object);
		} else {
			result[name] = data;
		}
	}

	return result;
}

export class Parser {
	constructor(map = { }) {
		this[rulesField] = map;
	}

	process(object) {
		const result = { };

		if (!object
			|| 'object' !== typeof object
			|| Array.isArray(object)
		) {
			return result;
		}

		function processData(key, data, rules) {
			const parsedResults = processRecord(key, data, rules, object);

			if (undefined === parsedResults || null === parsedResults) {
				return;
			}

			if ('object' !== typeof parsedResults) {
				throw new Error('Parsed results is not an object');
			}

			for (let key in parsedResults) {
				result[key] = parsedResults[key];
			}
		}

		// not Object.keys cause it can be inherited
		for (let key in this[rulesField]) {
			processData(key, object[key], this[rulesField][key]);
		}

		return result;
	}
}
