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
		}
	},

	pages: require('./pages')
}
