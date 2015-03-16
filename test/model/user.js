import chai from 'chai';
const assert = chai.assert;

import User from '../../src/background/model/user';

describe('User', function() {
	let user;

	beforeEach(function() {
		user = new User();
	});

	describe('Should use location field as coordinates source', function() {
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

});
