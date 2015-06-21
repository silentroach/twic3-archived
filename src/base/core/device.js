const platformField = Symbol('platform');

const modifierDefault = 'ctrlKey';
const modifierOSX = 'metaKey';

export default class Device {
	constructor(userAgent) {
		let platform = Device.WINDOWS;

		if (userAgent.indexOf('Mac') >= 0) {
			platform = Device.OSX;
		} else
		if (userAgent.indexOf('Windows') < 0) {
			platform = Device.LINUX;
		}

		this[platformField] = platform;
	}

	get platform() {
		return this[platformField];
	}

	get modifierKey() {
		return this.isOSX() ? modifierOSX : modifierDefault;
	}

	isOSX() {
		return Device.OSX === this[platformField];
	}
}

Device.WINDOWS = 'windows';
Device.OSX = 'osx';
Device.LINUX = 'linux';
