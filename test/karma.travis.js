import common from './karma.common';

export default function(config) {
	config.set({
		...common,
		reporters: ['mocha'],
		customLaunchers: {
			ChromeTravis: {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
		browsers: ['ChromeTravis']
	});
}
