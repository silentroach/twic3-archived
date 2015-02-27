module.exports = {
	manifest: {
		description: {
			en: 'Minimalist Twitter client',
			ru: 'Минималистичный клиент Twitter'
		}
	},

	content: require('./content'),

	toolbar: {
		about: {
			en: 'About',
			ru: 'О приложении'
		},
		disconnected: {
			en: 'Disconnected',
			ru: 'Нет соединения'
		}
	},

	pages: require('./pages')
};
