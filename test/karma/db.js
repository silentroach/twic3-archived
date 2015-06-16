import DB from 'core/db';

describe('DB', function() {

	it('should register last migration version', function() {
		const db = new DB('test');

		db.registerMigration(2, (instance) => 0);
		db.registerMigration(4, (instance) => 0);
		db.registerMigration(1, (instance) => 0);

		assert.equal(db.getVersion(), 4);

		db.remove();
	});

	describe('upgrade', function() {
		let db;
		let counter = 0;

		beforeEach(function() {
			// can already exists after remove cause it is async
			db = new DB('uptest' + (counter++));

			db.registerMigration(1, function(instance) {
				instance.createObjectStore('temp');
			});

			db.registerMigration(2, function(instance) {
				instance.deleteObjectStore('temp');
			});

			db.registerMigration(3, function(instance) {
				instance.createObjectStore('temp2');
			});
		});

		afterEach(function() {
			db.remove();
		});

		it('should fullfill store access', function() {
			return assert.isFulfilled(db.getStore('temp2'));
		});

		it('should reject non-existant store access', function() {
			return assert.isRejected(db.getStore('temp'));
		});
	});
});
