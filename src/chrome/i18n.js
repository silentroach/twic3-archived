import Localization from 'core/localization';

class ChromeLocalizationBackend {
	translate(...args) {
		return chrome.i18n.getMessage.apply(
			chrome, args
		);
	}

	getLanguage() {
		return chrome.i18n.getUILanguage()
			.split('-')
			.shift();
	}
}

export default new Localization(
	new ChromeLocalizationBackend()
);
