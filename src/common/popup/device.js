var device = {
	platforms: {
		WINDOWS: 'windows',
		OSX: 'osx',
		LINUX: 'linux'
	}
};

device.platform = device.platforms.WINDOWS;

if (navigator.appVersion.indexOf('Mac') >= 0) {
	device.platform = device.platforms.OSX;
} else
if (navigator.appVersion.indexOf('Windows') < 0) {
	device.platform = device.platforms.LINUX;
}

device.isRetina = window.devicePixelRatio > 1;

device.modifierKey = device.platform === device.platforms.OSX
	? 'metaKey' : 'ctrlKey';

export default device;
