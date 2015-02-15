import querystring from 'qs';

import Response from './response';

export default class Request {
	constructor(url, method = 'GET') {
		this.method = method;
		this.url = url;

		this.headers = { };
		this.data = { };
	}

	setHeader(name, value) {
		this.headers[name] = value;
		return this;
	}

	setRequestData(name, value) {
		this.data[name] = value;
		return this;
	}

	getData() {
		return this.data;
	}

	encode(str) {
		return encodeURIComponent(str)
			.replace(/\!/g, '%21')
			.replace(/\*/g, '%2A')
			.replace(/'/g, '%27')
			.replace(/\(/g, '%28')
			.replace(/\)/g, '%29');
	}

	send() {
		var request = this;

		return new Promise(function(resolve, reject) {
			var requestData = request.getData();
			var dataParams = [];
			var req = new XMLHttpRequest();
			var url = request.url;
			var data;

			for (let key of Object.keys(requestData)) {
				dataParams.push(
					[
						request.encode(key),
						request.encode(requestData[key])
					].join('=')
				)
			}

			data = dataParams.join('&');

			req.onreadystatechange = function() {
				var req = this;

				if (XMLHttpRequest.DONE === req.readyState) {
					var response = new Response(req);

					switch (req.status) {
						case 200:
							resolve(response);
							break;
						default:
							reject(response);
							break;
					}
				}
			};

			if ('GET' === request.method
				&& data.length > 0
			) {
				url += '?' + data;
			}

			req.open(request.method, url);

			Object.keys(request.headers).forEach(key => req.setRequestHeader(key, request.headers[key]));

			if ('GET' === request.method) {
				req.send();
			} else {
				req.send(data);
			}
		});
	}
}
