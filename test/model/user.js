import chai from 'chai';
const assert = chai.assert;

import User from '../../src/background/model/user';

describe('Model.User', function() {
	let user;

	beforeEach(function() {
		user = new User();
	});

	describe('should use location field as coordinates source', function() {
		it('no coords found', function() {
			user.parse({
				location: 'Moscow'
			});

			assert.notProperty(user, 'coords');
		});

		it('basic check', function() {
			user.parse({
				location: 'iPhone: 55.738159,37.680527'
			});

			assert.property(user, 'coords');
			assert.deepEqual(user.coords, [55.738159, 37.680527]);
		});

		it('negative coord', function() {
			user.parse({
				location: 'iPhone: 55.738159,-35.680527'
			});

			assert.property(user, 'coords');
			assert.deepEqual(user.coords, [55.738159, -35.680527]);
		});

		it('out of bounds value', function() {
			user.parse({
				location: '55.738159,-235.680527'
			});

			assert.notProperty(user, 'coords');
		});
	});

	it('should normalize screen name for index', function() {
		const screenName = 'SoMeThInG';

		user.parse({
			'screen_name': screenName
		});

		assert.property(user, 'screenName');
		assert.property(user, 'screenNameNormalized');
		assert.strictEqual(user.screenName, screenName);
		assert.strictEqual(user.screenNameNormalized, screenName.toLowerCase());
	});

	it('should replace avatar size with {size} template', function() {
		user.parse({
			'profile_image_url_https': 'https://lalala.ru/someavatar_normal.jpg'
		});

		assert.property(user, 'avatar');
		assert.equal(user.avatar.indexOf('{size}') >= 0, true);
	});

	it('should replace url with <a> element');

});
