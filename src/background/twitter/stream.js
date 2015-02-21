import EventEmitter from '../../eventEmitter';
import OAuthStreamRequest from '../request/OAuthStream';

// check 420 error (too much requests)
export default class TwitterStream extends EventEmitter {
	constructor(url, token) {
		super();

		this.url = url;
		this.token = token;
		this.request = null;
		this.requestData = { };

		this.errorsCount = 0;

		this.lastUpdateTime = 0;
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

			this.lastUpdateTime = Date.now();

			if ('' === trimmed) {
				return;
			}

			buffer = [buffer, data].join(''); // not trimmed!

			delimiterPos = buffer.indexOf('\n');
			while (delimiterPos >= 0) {
				chunk = buffer.substring(0, delimiterPos).trim();
				buffer = buffer.substring(delimiterPos + 1);

				if ('' !== chunk) {
					try {
						parsed = JSON.parse(chunk);

						stream.handleMessage.call(stream, parsed);
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

		this.request.on('done', function() {
			stream.request = null;
			stream.emit('done');
		});

		this.request.send(this.token);
	}

	handleMessage(object) {
		var type;
		var data;

		if (undefined !== object.friends_str) {
			type = TwitterStream.TYPE_FRIENDS_LIST;
			data = object.friends_str;
		}

		console.groupCollapsed('streaming api data', type || 'unknown type');
		console.debug(object);
		console.groupEnd();

		if (type) {
			this.emit('data', type, data);
		}
	}

	stop() {
		if (this.request) {
			this.request.abort();
		}
	}
}

TwitterStream.TYPE_FRIENDS_LIST = 0;

if ('production' !== process.env.NODE_ENV) {
	TwitterStream.TYPE_FRIENDS_LIST = 'friends_list';
}
