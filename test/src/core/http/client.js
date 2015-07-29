import Client from 'core/http/client';
import Request from 'core/http/request';

describe('HTTP', () => describe('Client', () => {

	const testDomain = 'twic.ext';
	const url = `http://${testDomain}/someurl`;

	let server;
	let client;

	before(() => server = sinon.fakeServer.create());
	after(() => server.restore());

	beforeEach(() => {
		client = new Client();
	});

	describe('get/post proxy methods', () => {
		const methodsMap = {
			'get': 'GET',
			'post': 'POST'
		};

		Object.keys(methodsMap).forEach(method => {
			const requestMethod = methodsMap[method];

			it(`.${method} should create ${requestMethod} request`, () => {
				const request = client[method](url);

				assert.instanceOf(request, Request);
				assert.equal(request.method, requestMethod);
				assert.equal(request.url, url);
			});
		});
	});

	describe('#send', () => {

		it('should call all middlewares', done => {
			const middleware = sinon.spy();
			client.use(middleware);

			client
				.send(
					client.get(`http://${testDomain}/someurl`)
				)
				.then(() => {
					assert(middleware.called);
					done();
				});

			server.respondWith('GET', url, 'some reply');
			server.respond();
		});

		it('should reply with promise', done => {
			const statusCode = 200;
			const content = JSON.stringify({test: 5});
			const request = client.get(url);

			client
				.send(request)
				.then(response => {
					assert.equal(response.status, statusCode);
					assert.equal(response.body, content);

					done();
				});

			server.respondWith('GET', url, [statusCode, {'Content-Type': 'application/json'}, content]);
			server.respond();
		});

		it('should fail on status codes more than 599', () => {
			const request = client.get(url);

			assert.isRejected(client.send(request));

			server.respondWith('GET', url, [666, { }, 'test']);
			server.respond();
		});

		it('should not fail on 1223 statusCode', () => {
			const request = client.get(url);

			assert.isFulfilled(client.send(request));

			server.respondWith('GET', url, [1223, { }, 'test']);
			server.respond();
		});

	});

}));
