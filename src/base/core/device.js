const platformField = Symbol('platform');

const modifierDefault = 'ctrlKey';
const modifierOSX = 'metaKey';

export const Platforms = {
	Windows: 'windows',
	OSX: 'osx',
	Linux: 'linux'
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

		this[platformField] = platform;
	}

	get platform() {
		return this[platformField];
	}

	get modifierKey() {
		return this.isOSX() ? modifierOSX : modifierDefault;
	}

	isOSX() {
		return Platforms.OSX === this[platformField];
	}
}
