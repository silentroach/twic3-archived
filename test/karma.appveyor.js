import common from './karma.common';

// same as Travis, but without coveralls

export default function(config) {
	config.set({
		...common,
		customLaunchers: {
			ChromeAppveyor: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
		reporters: ['mocha'],
		browsers: ['ChromeAppveyor']
	});
}
