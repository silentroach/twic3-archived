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
		browsers: ['ChromeTravis']
	});
}
