import DBIndexCursor from './cursor';
import { promisify } from './request';

export default class DBIndex {
	constructor(index) {
		this.index = index;
	}

	getByValue(value) {
		return promisify(this.index.get(value));
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
