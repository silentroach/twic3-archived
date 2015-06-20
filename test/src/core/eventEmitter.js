import EventEmitter from 'core/eventEmitter';

describe('EventEmitter', function() {
	var em;

	beforeEach(function() {
		em = new EventEmitter();
	});

	it('should throw an error if listener is not a function', function() {
		assert.throws(function() {
			em.on('test', true);
		});

		assert.throws(function() {
			em.off('test', true);
		});
	});

	it('should call function once if it added twice', function() {
		var callback = sinon.spy();

		em.on('test', callback);
		em.on('test', callback);

		em.emit('test');

		assert(callback.called);
		assert(callback.calledOnce);
	});

	it('should call handler once if it is passed via once method', function() {
		var callback = sinon.spy();

		em.once('test', callback);

		em.emit('test');
		em.emit('test', 5);

		assert(callback.called);
		assert(callback.calledOnce);
	});

	it('should not handle event if it is off', function() {
		var callback = sinon.spy();

		em.on('test', callback);
		em.off('test');

		em.emit('test');

		assert(!callback.called);

		em.on('test', callback);
		em.off('test', callback);

		assert(!callback.called);
	});
});
