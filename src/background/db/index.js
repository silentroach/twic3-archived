const INDEX_FIELD = Symbol('index');

export default class DBIndex {
	constructor(index) {
		this[INDEX_FIELD] = index;
	}

	getByValue(value) {
		var self = this;

		return new Promise(function(resolve, reject) {
			const request = self[INDEX_FIELD].get(value);

			request.onerror = function(event) {
				reject(event);
			};

			request.onsuccess = function(event) {
				resolve(request.result);
			};
		});
	}
}
