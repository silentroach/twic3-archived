export default class Response {
	constructor(xhr) {
		this.xhr = xhr;
		this.headers = null;
	}

	get status() {
		return this.xhr.status;
	}

	get content() {
		var text = this.xhr.responseText;
		var contentType = this.getHeader('content-type');

		if (undefined !== contentType) {
			[contentType] = contentType.split(';');
			contentType = contentType.trim().toLowerCase();

			switch (contentType) {
				case 'application/json':
					return JSON.parse(text);
				default:
					return text;
			}
		}

		return text;
	}

	getHeader(name) {
		var headerName = name.toLowerCase();

		if (null === this.headers) {
			this.headers = parseHeaders(this.xhr);
		}

		return this.headers[headerName];
	}
}

function parseHeaders(xhr) {
	var headers = xhr.getAllResponseHeaders();
	var result = { };

	if (!headers) {
		return result;
	}

	headers.split('\n').forEach(function(hdr) {
		var header = hdr.trim();
		var idx;
		var name;
		var value;

		if ('' === header) {
			return;
		}

		idx = header.indexOf(':');
		if (idx < 0) {
			return;
		}

		name = header.substr(0, idx).trim().toLowerCase();
		value = header.substr(idx + 1).trim();

		result[name] = value;
	});

	return result;
}
