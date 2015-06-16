import common from './karma.common';

export default function(config) {
	config.set({
		...common,
		singleRun: false,
		logLevel: config.LOG_INFO,
		reporters: ['mocha', 'coverage', 'clear-screen'],
		browsers: ['Chrome']
	});
}
