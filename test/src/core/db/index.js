import { DB } from 'core/db';

describe('DB', function() {

	it('should register last migration version', function() {
		const db = new DB('test');

		db.registerMigration(2, () => true);
		db.registerMigration(4, () => true);
		db.registerMigration(1, () => true);

		assert.equal(db.getVersion(), 4);

		db.remove();
	});

	describe('upgrade', function() {
		let db;
		let counter = 0;
		let order = [];

		beforeEach(function() {
			order = [];

			// can already exists after remove cause it is async
			db = new DB('uptest' + (counter++));

			db.registerMigration(1, function(instance) {
				order.push(1);
				instance.createObjectStore('temp');
			});

			db.registerMigration(3, function(instance) {
				order.push(3);
				instance.createObjectStore('temp2');
			});

			db.registerMigration(1, function(instance) {
				order.push(1);
				instance.createObjectStore('temp5');
			});

			db.registerMigration(2, function(instance) {
				order.push(2);
				instance.deleteObjectStore('temp');
			});
		});

		afterEach(function() {
			db.remove();
		});

		it('should call all migrations for same versions', function() {
			return assert.isFulfilled(db.getStore('temp5'));
		});

		it('should fullfill store access', function() {
			return assert.isFulfilled(db.getStore('temp2'));
		});

		it('should use the same getDB promise for multiple calls', () => {
			return assert.isFulfilled(
				db.getStore('temp5').then(() => db.getStore('temp2'))
			);
		});

		it('should reject non-existant store access', function() {
			return assert.isRejected(db.getStore('temp'));
		});

		it('should call migrations in order', function() {
			return assert.becomes(
				db
					.getStore('temp5')
					.then(function() {
						return order;
					}),
				[1, 1, 2, 3]
			);
		});
	});
});
