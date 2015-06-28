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

	it('should call function once if it was added twice', function() {
		const callback = sinon.spy();

		em.on('test', callback);
		em.on('test', callback);

		em.emit('test');

		assert(callback.called);
		assert(callback.calledOnce);
	});

	it('should call handler once if it is passed via once method', function() {
		const callback = sinon.spy();

		em.once('test', callback);

		em.emit('test');
		em.emit('test', 5);

		assert(callback.called);
		assert(callback.calledOnce);
	});

	it('should not handle event if it is off', function() {
		const callback = sinon.spy();

		em.on('test', callback);
		em.off('test');

		em.emit('test');

		assert(!callback.called);

		em.on('test', callback);
		em.off('test', callback);

		assert(!callback.called);
	});

	it('should remove correct event on off', function() {
		const callback = sinon.spy();
		const callbackNext = sinon.spy();

		em.on('test', callback);
		em.on('test', callbackNext);

		em.off('test', callback);

		em.emit('test');

		assert(!callback.called);
		assert(callbackNext.calledOnce);
	});

	it('should continue chain on off not found callbacks', function() {
		const callback = sinon.spy();
		const callbackNotFound = function() { };

		em.on('test', callback);

		const chain = em.off('test', callback).off('test', callback).off('test', callbackNotFound).off('test');

		assert(chain instanceof EventEmitter);
	});

});
