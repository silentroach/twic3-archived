module.exports = {
	manifest: {
		description: {
			en: 'Minimalist Twitter client',
			ru: 'Минималистичный клиент Twitter'
		}
	},

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

	components: require('./components'),

	pages: require('./pages')
};
