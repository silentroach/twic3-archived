import Localization from 'core/localization';

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

export default new Localization(
	new ChromeLocalizationBackend()
);
