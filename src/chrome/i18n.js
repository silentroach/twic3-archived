import i18n from '@twic/i18n';

const language = chrome.i18n.getUILanguage()
	.split('-')
	.shift();

class ChromeLocalizationBackend {
	translate(...args) {
		return chrome.i18n.getMessage.apply(
			chrome, args
		);
	}

	getLanguage() {
		return language;
	}
}

export default new i18n(
	new ChromeLocalizationBackend()
);
