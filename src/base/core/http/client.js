import qs from 'qs';

import Request from './request';
import Response from './response';

const middleField = Symbol('middleware');

export default class Client {
	constructor(method, url) {
		this[middleField] = [];
	}

	use(middleware) {
		this[middleField].push(middleware);
		return this;
	}

	get(url) {
		return new Request('GET', url);
	}

	post(url) {
		return new Request('POST', url);
	}

	send(request) {
		return new Promise((resolve, reject) => {
			this[middleField].forEach(middleware => middleware(request));

			const xhr = new XMLHttpRequest();
			const query = { };
			let url = request.url;

			request.query.forEach((value, key) => query[key] = value);

			const queryString = qs.stringify(query);

			xhr.responseType = request.type;
			xhr.onerror = () => reject(new TypeError('Network request failed'));
			xhr.onload = () => {
				const status = 1223 === xhr.status ? 204 : xhr.status;

				if (status < 100 || status > 599) {
					reject(new TypeError('Network request failed'));
				}

				resolve(new Response(xhr));
			};

			if ('GET' === request.method
				&& queryString
			) {
				url = [url, queryString].join('?');
			}

			xhr.open(request.method, url, /* async */ true);

			request.headers.forEach((value, key) => xhr.setRequestHeader(key, value));

			xhr.send('GET' === request.method ? null : queryString);
		});
	}
}
