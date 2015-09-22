module.exports = config => config.set(
	Object.assign(
		require('./karma.common'),
		{
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
