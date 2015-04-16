import moment from 'moment';

moment.locale(
	chrome.i18n.getUILanguage().split('-').shift()
);

export default moment;
