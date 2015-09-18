const common = require('./karma.common');

module.exports = function(config) {
	config.set(
		Object.assign(
			common, {
				logLevel: config.LOG_INFO,
				reporters: ['mocha', 'coverage'],
				browsers: ['Chrome']
			}
		)
	);
};
