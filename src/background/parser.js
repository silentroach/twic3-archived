const RULES_FIELD = Symbol('parser');

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
			case Parser.TYPE_INT:
				data = Number(data);
				if (Number.isNaN(data)) {
					data = undefined;
				}

				break;
			case Parser.TYPE_STRING:
				if ('string' === typeof data
					&& '' === data.trim()
				) {
					data = undefined;
				} else {
					data = String(data);
				}

				break;
			case Parser.TYPE_BOOLEAN:
				data = Boolean(data);
				break;
			case Parser.TYPE_DATE:
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

export default class Parser {
	constructor(map = { }) {
		this[RULES_FIELD] = map;
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
		for (let key in this[RULES_FIELD]) {
			processData(key, object[key], this[RULES_FIELD][key]);
		}

		return result;
	}
}

Parser.TYPE_UNDEFINED = 0;
Parser.TYPE_INT = 1;
Parser.TYPE_STRING = 2;
Parser.TYPE_BOOLEAN = 3;
Parser.TYPE_DATE = 4;
