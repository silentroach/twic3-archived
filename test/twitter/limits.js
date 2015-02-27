import chai from 'chai';
const assert = chai.assert;

import Limits from '../../src/background/twitter/limits';
import Response from '../../src/background/response';

class FakeXHR {
	constructor(headers) {
		this.headers = headers;
	}

	getAllResponseHeaders() {
		var headers = [];
		for (let key of Object.keys(this.headers)) {
			headers.push([key, this.headers[key]].join(':'));
		}

		return headers.join('\n');
	}
}

describe('Twitter.Limits', function() {
	var limits;
	var path = '/test';

	beforeEach( function() {
		limits = new Limits();
	});

	it('should restrict if correct headers supplied', function() {
		var response = new Response(new FakeXHR({
			'x-rate-limit-remaining': 0,
			'x-rate-limit-reset': Date.now() + 100000
		}));

		limits.update(path, response);

		assert.equal(limits.isRestricted(path), true);
	});

	it('should invalidate limit after reset timestamp', function(callback) {
		var offset = 50;
		var response = new Response(new FakeXHR({
			'x-rate-limit-remaining': 0,
			'x-rate-limit-reset': Date.now() + offset
		}));

		limits.update(path, response);

		assert.equal(limits.isRestricted(path), true);
		assert.equal(limits.isRestricted(path), true);

		setTimeout(function() {
			assert.equal(limits.isRestricted(path), false);
			callback();
		}, offset + 10);
	});

	it('should not restrict anything if rate limit headers not supplied', function() {
		limits.update(path, new Response(new FakeXHR({})));

		assert.equal(limits.isRestricted(path), false);
	});

	it('should handle race conditions on update', function() {
		var resetTime = Date.now() + 100;
		var response = new Response(new FakeXHR({
			'x-rate-limit-remaining': 0,
			'x-rate-limit-reset': resetTime
		}));
		var raceResponse = new Response(new FakeXHR({
			'x-rate-limit-remaining': 2,
			'x-rate-limit-reset': resetTime
		}));

		limits.update(path, response);
		assert.equal(limits.isRestricted(path), true);

		limits.update(path, raceResponse);
		assert.equal(limits.isRestricted(path), true);
	});
});
