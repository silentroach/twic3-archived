export default class Limits {
	constructor(token = null) {
		this.token = token ? token.token : null;
		this.limits = { };
	}

	update(path, response) {
		var remains = response.getHeader('x-rate-limit-remaining');
		var reset = response.getHeader('x-rate-limit-reset');
		var oldRemains;
		var oldReset;

		if (remains && reset) {
			// avoiding race condition
			if (undefined !== this.limits[path]) {
				[oldRemains, oldReset] = this.limits[path];

				if (oldReset === reset
					&& oldRemains < remains
				) {
					console.log(
						'Rate limit race condition detected, leaving old values',
						path, oldRemains, oldReset
					);

					return;
				}
			}

			console.info('Rate limit updated for', path, remains, reset);
			this.limits[path] = [remains, reset];
		}
	}

	isRestricted(path) {
		var limit = this.limits[path];
		var remains, reset;

		if (undefined === limit) {
			return false;
		}

		[remains, reset] = limit;
		if (reset <= Date.now()) {
			delete this.limits[path];
			return false;
		}

		return remains > 0;
	}
}
