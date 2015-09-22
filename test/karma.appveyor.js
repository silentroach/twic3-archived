// same as Travis, but without coveralls

module.exports = config => config.set(
	Object.assign(
		require('./karma.common'),
		{
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
