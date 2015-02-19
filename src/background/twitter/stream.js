import EventEmitter from '../../eventEmitter';
import OAuthStreamRequest from '../request/OAuthStream';

// check 420 error (too much requests)
export default class TwitterStream extends EventEmitter {
	constructor(url, token) {
		var request;

		super();

		this.url = url;
		this.token = token;
		this.request = null;
		this.requestData = { };

		this.errorsCount = 0;
	}

	setRequestData(key, value) {
		this.requestData[key] = value;
		return this;
	}

	start() {
		var stream = this;
		var buffer = '';

		if (this.request) {
			return;
		}

		this.request = new OAuthStreamRequest(this.url);

		for (let key of Object.keys(this.requestData)) {
			this.request.setRequestData(key, this.requestData[key]);
		}

		this.request.on('data', function(data) {
			var trimmed = data.trim();
			var delimiterPos;
			var chunk;
			var parsed;

			if ('' === trimmed) {
				return;
			}

			buffer = [buffer, data].join(''); // not trimmed!
			console.log('buffer', buffer);

			delimiterPos = buffer.indexOf('\n');
			while (delimiterPos >= 0) {
				chunk = buffer.substring(0, delimiterPos).trim();
				buffer = buffer.substring(delimiterPos + 1);

				if ('' !== chunk) {
					try {
						parsed = JSON.parse(chunk);

						console.groupCollapsed('streaming api data');
						console.log(parsed);
						console.groupEnd();
					} catch (e) {
						console.error('can\'t parse streaming api chunk', data);

						// isn't great, lets flush buffer
						buffer = '';
						stream.errorsCount += 1;
					}
				}

				delimiterPos = buffer.indexOf('\n');
			}
		});

		this.request.send(this.token);
	}

	stop() {
		if (this.request) {
			this.request.abort();
		}
	}
}
