import qs from 'qs';

import Client from 'core/http/client';
import Request from 'core/http/request';
import OAuthToken from 'core/struct/token';

import oauthMiddleware from 'core/http/middleware/oauth';

describe('HTTP', () => describe('middleware', () => describe('#oauth', () => {

	const testDomain = 'twic.ext';

	let server;
	let client;

	before(() => server = sinon.fakeServer.create());
	after(() => server.restore());

	beforeEach(() => {
		client = new Client();
	});

	it('should sign request with token', done => {
		const statusCode = 200;
		const url = `http://${testDomain}/someurl`;
		const content = 'something';
		const request = client.get(url);
		const token = new OAuthToken('token', 'secret');

		request.query
			.set('test', 5)
			.set('anotherTest', 10);

		client
			.use(oauthMiddleware('appkey', 'appsecret', token))
			.send(request)
			.then(response => {
				const queryString = server.requests[0].url.split('?').pop();
				const parsed = qs.parse(queryString);

				assert(parsed);

				[
					'oauth_consumer_key', 'oauth_signature_method', 'oauth_version',
					'oauth_timestamp', 'oauth_nonce', 'oauth_signature', 'oauth_token'
				].forEach(key => assert.property(parsed, key));

				done();
			});

		server.respondWith('GET', url, [statusCode, {'Content-Type': 'application/json'}, content]);
		server.respond();
	});

})));
