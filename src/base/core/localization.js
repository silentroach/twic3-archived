const backendSymbol = Symbol('backend');

export default class Localization {
	constructor(backend) {
		this[backendSymbol] = backend;
	}

	translate(originalKey, ...args) {
		const backend = this[backendSymbol];
		const key = originalKey.replace(/\./g, '_');

		return backend.translate.apply(backend, [key, ...args]);
	}

	plural(number, endings) {
		const mod10 = number % 10;
		const mod100 = number % 100;
		let res = '';

		if (1 === mod10
			&& 11 !== mod100
		) {
			res = this.translate(endings[0]);
		} else
		if (mod10 >= 2
			&& mod10 <= 4
			&& (mod100 < 10
				|| mod100 >= 20
			)
		) {
			res = this.translate(endings[1]);
		} else {
			res = this.translate(endings[2]);
		}

		return [number, res].join(' ');
	}
}
