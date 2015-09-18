const common = require('./karma.common');

module.exports = function(config) {
	config.set(
		Object.assign(
			common, {
				customLaunchers: {
					ChromeTravis: {
						base: 'Chrome',
						flags: ['--no-sandbox']
					}
				},
				reporters: ['mocha', 'coverage', 'coveralls'],
				browsers: ['ChromeTravis'],
				coverageReporter: {
					type: 'lcov',
					dir: 'coverage/'
				}
			}
		)
	);
};
