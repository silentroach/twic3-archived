const common = require('./karma.common');

// same as Travis, but without coveralls

module.exports = function(config) {
	config.set(
		Object.assign(
			common, {
				customLaunchers: {
					ChromeAppveyor: {
						base: 'Chrome',
						flags: ['--no-sandbox']
					}
				},
				reporters: ['mocha'],
				browsers: ['ChromeAppveyor']
			}
		)
	);
};
