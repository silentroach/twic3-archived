module.exports = config => config.set(
	Object.assign(
		require('./karma.common'),
		{
			logLevel: config.LOG_INFO,
			reporters: ['mocha', 'coverage'],
			browsers: ['Chrome']
		}
	)
);
