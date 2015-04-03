// run it with phantomjs

var page = require('webpage').create();
var fs = require('fs');
// ---
var srcPath = fs.absolute(phantom.libraryPath + '/../src/images');
var trgPath = fs.absolute(phantom.libraryPath + '/../build/images');

var settings = {
	'toolbar@2x.png': {
		size: { width: 38, height: 38 },
		source: 'toolbar/default.svg'
	},
	'toolbar.png': {
		size: { width: 19, height: 19 },
		zoom: 19 / 38,
		source: 'toolbar/default.svg'
	},

	'toolbar.disconnected@2x.png': {
		size: { width: 38, height: 38 },
		source: 'toolbar/disconnected.svg'
	},
	'toolbar.disconnected.png': {
		size: { width: 19, height: 19 },
		zoom: 19 / 38,
		source: 'toolbar/disconnected.svg'
	},

	'app.16.png': {
		size: { width: 16, height: 16 },
		zoom: 16 / 38,
		source: 'toolbar/default.svg'
	},
	'app.48.png': {
		size: { width: 48, height: 48 },
		zoom: 48 / 38,
		source: 'toolbar/default.svg'
	},
	'app.128.png': {
		size: { width: 128, height: 128 },
		zoom: 128 / 38,
		source: 'toolbar/default.svg'
	}
};

function convert(config) {
	var filename = Object.keys(config).shift();
	var settings = config[filename];

	console.log(settings.source + ' -> ' + filename);

	page.viewportSize = settings.size;

	settings.size.left = 0;
	settings.size.top = 0;
	page.clipRect = settings.size;

	page.zoomFactor = settings.zoom ? settings.zoom : 1;

	page.open([srcPath, settings.source].join(fs.separator), function(status) {
		if (status !== 'success') {
			console.log('Unable to open file');
			phantom.exit();
		} else {
			page.render([trgPath, filename].join(fs.separator));

			delete config[filename];

			if (Object.keys(config).length) {
				convert(config);
			} else {
				phantom.exit();
			}
		}
	} );
}

console.log('');
convert(settings);
