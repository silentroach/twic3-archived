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
				return new Promise(function(resolve, reject) {
					req.onreadystatechange = function() {
						var responseLength;

						if (XMLHttpRequest.LOADING === req.readyState) {
							responseLength = req.responseText.length;
							if (responseLength > offset) {
								request.emit('data', req.responseText.substring(offset));
								offset = responseLength;
							}
						}
					};
				});
			});
	}
}
