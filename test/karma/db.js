import DB from '../../src/_chaos/background/db';

describe('DB', function() {

	it('should upgrade ok', function(done) {
		const db = new DB();

		db.getDB().then(function(db) {
			assert.ok(db);
			assert.equal(db.version, DB.VERSION);

			done();
		});
	});

});
