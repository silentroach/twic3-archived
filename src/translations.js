module.exports = {
	manifest: {
		description: {
			en: 'Minimalist Twitter client',
			ru: 'Минималистичный клиент Twitter'
		}
	},

	content: {
		auth: {
			progress: {
				en: 'Authentication...',
				ru: 'Авторизация...'
			},
			success: {
				en: ['Thank you, $name$! Now you can close the window', {
					name: '$1'
				}],
				ru: ['Спасибо, $name$! Теперь окно можно закрыть.', {
					name: '$1'
				}]
			},
			error: {
				en: 'Authentication error',
				ru: 'Ошибка авторизации'
			}
		}
	},

	accounts: {
		add: {
			en: 'Add new account',
			ru: 'Добавить учётную запись'
		},
		errors: {
			connection: {
				en: 'No internet connection',
				ru: 'Отсутствует соединение'
			}
		}
	},

	toolbar: {
		about: {
			en: 'About',
			ru: 'О приложении'
		}
	}
}
