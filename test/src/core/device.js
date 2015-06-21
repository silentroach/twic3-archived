import Device from 'core/device';

const genericOSXAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) Chrome/43.0.2357.65 Electron/0.28.2';
const genericNonOSXAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.0 Safari/537.36';

const userAgentMap = {
	[genericOSXAgent]: Device.OSX,
	'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36': Device.WINDOWS,
	[genericNonOSXAgent]: Device.LINUX
}

describe('Device', function() {

	it('should correctly detect platforms', function() {
		Object.keys(userAgentMap).forEach(function(userAgent) {
			assert.equal((new Device(userAgent)).platform, userAgentMap[userAgent], userAgent);
		});
	});

	it('should return alternative modifierKey for OS X', function() {
		assert.equal((new Device(genericOSXAgent)).modifierKey, 'metaKey');
		assert.equal((new Device(genericNonOSXAgent)).modifierKey, 'ctrlKey');
	});

});
