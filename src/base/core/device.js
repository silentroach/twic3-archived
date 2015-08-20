const propPlatform = Symbol('platform');

export const Platforms = {
	Windows: 0,
	OSX: 1,
	Linux: 2
};

export default class Device {
	constructor(userAgent) {
		let platform = Platforms.Windows;

		if (userAgent.indexOf('Mac') >= 0) {
			platform = Platforms.OSX;
		} else
		if (userAgent.indexOf('Windows') < 0) {
			platform = Platforms.Linux;
		}

		this[propPlatform] = platform;
	}

	get platform() {
		return this[propPlatform];
	}

	get modifierKey() {
		return this.isOSX() ? 'metaKey' : 'ctrlKey';
	}

	isOSX() {
		return Platforms.OSX === this[propPlatform];
	}
}
