export function processLineBreaks(input) {
	return input
		.replace(/[\r\n]/g, '\n')
		.replace(/\n{2,}/g, '\n\n')  // convert 3+ breaks to 2
		.trim()
		.replace(/\n/g, '<br />');
}
