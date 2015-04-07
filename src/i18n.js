const i18n = { };

i18n.translate = function(key) {
	const args = Array.apply(null, arguments);
	args[0] = key.replace(/\./g, '_');
	return chrome.i18n.getMessage.apply(chrome, args);
};

i18n.plural = function(number, endings) {
	const mod10 = number % 10;
	const mod100 = number % 100;
	let res = '';

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
