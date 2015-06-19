export function encodeUrlPart(str) {
	return encodeURIComponent(str)
			.replace(/\!/g, '%21')
			.replace(/\*/g, '%2A')
			.replace(/'/g, '%27')
			.replace(/\(/g, '%28')
			.replace(/\)/g, '%29');
}
