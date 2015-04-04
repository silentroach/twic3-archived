import common from './karma.common';

export default function(config) {
	config.set({
		...common,
		logLevel: config.LOG_INFO,
		reporters: ['mocha'],
		browsers: ['Chrome']
	});
}
