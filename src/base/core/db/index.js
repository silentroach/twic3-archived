import DBIndexCursor from './cursor';

export default class DBIndex {
	constructor(index) {
		this.index = index;
	}

	getByValue(value) {
		const request = this.index.get(value);

		return new Promise(function(resolve, reject) {
			request.onerror = function(event) {
				reject(event);
			};

			request.onsuccess = function(event) {
				resolve(request.result);
			};
		});
	}

	getCursor(range, ...args) {
		const request = this.index.openKeyCursor(range, ...args);

		return new Promise(function(resolve, reject) {
			request.onsuccess = function(event) {
				resolve(new DBIndexCursor(event.target.result));
			};

			request.onerror = function(error) {
				reject(error);
			};
		});
	}
}
