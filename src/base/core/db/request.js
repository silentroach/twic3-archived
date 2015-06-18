export function promisify(request) {
	return new Promise(function(resolve, reject) {
		request.onerror = function(event) {
			reject(event);
		};

		request.onsuccess = function(event) {
			resolve(request.result);
		};
	});
}
