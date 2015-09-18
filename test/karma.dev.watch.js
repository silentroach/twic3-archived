const common = require('./karma.common');

module.exports = function(config) {
	config.set(
		Object.assign(
			common, {
				singleRun: false,
				logLevel: config.LOG_INFO,
				reporters: ['mocha', 'coverage', 'clear-screen'],
				browsers: ['Chrome']
			}
		)
	);
};
