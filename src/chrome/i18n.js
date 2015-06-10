import Localization from 'localization';

class ChromeLocalizationBackend {
	translate(...args) {
		return chrome.i18n.getMessage.apply(
			chrome, args
		);
	}
}

export default new Localization(
	new ChromeLocalizationBackend()
);
