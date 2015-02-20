import hmacsha1 from 'hmacsha1';

import OAuthRequest from './OAuth';

export default class RequestOAuthStream extends OAuthRequest {
	send(token) {
		var request = this;
		var offset = 0;

		if (token) {
			this.sign(token);
		} else {
			this.sign();
		}

		return this.startXMLHttpRequest()
			.then(function(req) {
				req.onreadystatechange = function() {
					var responseLength;

					switch (req.readyState) {
						case XMLHttpRequest.LOADING:
							responseLength = req.responseText.length;
							if (responseLength > offset) {
								request.emit('data', req.responseText.substring(offset));
								offset = responseLength;
							}
							break;
						case XMLHttpRequest.DONE:
							request.emit('done');
							break;
					}
				};
			});
	}
}
