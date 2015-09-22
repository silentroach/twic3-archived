module.exports = config => config.set(
	Object.assign(
		require('./karma.common'),
		{
			singleRun: false,
			logLevel: config.LOG_INFO,
			reporters: ['mocha', 'coverage', 'clear-screen'],
			browsers: ['Chrome']
		}
	)
);
