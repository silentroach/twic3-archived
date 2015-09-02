// https://instagram.com/developer/embedding/

const sizes = [
	['t', 150], // thumbnail
	['m', 320], // medium
	['l', 1080]  // large
];

export default function instagram(path, domain, url) {
	const [, shortCode] = /\/p\/(\w+)/.exec(path);

	if (!shortCode) {
		return null;
	}

	return {
		gallery: [ {
			url,
			preview: sizes.map(([alias, width]) => {
				return {
					url: `https://${domain}/p/${shortCode}/media/?size=${alias}`,
					size: [width, width]
				};
			})
		} ]
	};
}
