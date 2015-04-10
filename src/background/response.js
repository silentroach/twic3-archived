export default class Response {
	constructor(xhr) {
		this.xhr = xhr;
		this.headers = null;
	}

	get status() {
		return this.xhr.status;
	}

	get content() {
		const text = this.xhr.responseText;
		let contentType = this.getHeader('content-type');

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
		const headerName = name.toLowerCase();

		if (null === this.headers) {
			this.headers = parseHeaders(this.xhr);
		}

		return this.headers[headerName];
	}
}

function parseHeaders(xhr) {
	const headers = xhr.getAllResponseHeaders();
	const result = { };

	if (!headers) {
		return result;
	}

	headers.split('\n').forEach(function(hdr) {
		const header = hdr.trim();
		let idx;
		let name;
		let value;

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
