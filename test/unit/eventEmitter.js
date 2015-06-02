import EventEmitter from '../../src/common/eventEmitter';

describe('EventEmitter', function() {
	var em;

	beforeEach(function() {
		em = new EventEmitter();
	});

	it('should call handler once if it is passed via once method', function() {
		var callback = sinon.spy();

		em.once('test', callback);

		em.emit('test');
		em.emit('test');

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
