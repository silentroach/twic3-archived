var i18n = { };

i18n.translate = function() {
	arguments[0] = arguments[0].replace(/\./g, '_');
	return chrome.i18n.getMessage.apply(chrome, arguments);
}

i18n.plural = function(number, endings) {
	var mod10  = number % 10;
	var mod100 = number % 100;
	var res = '';

	if (1 === mod10
		&& 11 !== mod100
	) {
		res = i18n.translate(endings[0]);
	} else
	if (mod10 >= 2
		&& mod10 <= 4
		&& (mod100 < 10
			|| mod100 >= 20
		)
	) {
		res = i18n.translate(endings[1]);
	} else {
		res = i18n.translate(endings[2]);
	}

	return number + ' ' + res;
};

export default i18n;
