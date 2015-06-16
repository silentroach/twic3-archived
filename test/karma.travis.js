import common from './karma.common';

export default function(config) {
	config.set({
		...common,
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
	});
}
