var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var through = require('through2');
var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpJade = require('gulp-jade');
var gulpSVG = require('gulp-svg-sprite');
var gulpRename = require('gulp-rename');
var gulpEslint = require('gulp-eslint');

var twitterText = require('twitter-text');
var webpack = require('webpack');
var rimraf = require('rimraf');

var packageInfo  = require('./package.json');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = 'production' === process.env.NODE_ENV;
var buildPath = path.resolve(__dirname, 'build');

var loaderBabelParams = [
	'blacklist[]=useStrict',
	'blacklist[]=es6.constants',
	'blacklist[]=react',
	'loose=all'
];

if (isProduction) {
	loaderBabelParams
		.push(
			'optional[]=minification.removeConsoleCalls',
			'optional[]=minification.removeDebugger',
			'optional[]=minification.renameLocalVariables'
		);
}

var loaderBabel = 'babel-loader?' + loaderBabelParams.join('&');
var loaderCSS = ['css-loader', 'autoprefixer-loader?{browsers:["Chrome >= 40"]}'].join('!');

var imageLoaderParams = [
	'name=images/[name].[ext]'
];

if (isProduction) {
	imageLoaderParams.push('optimizationLevel=7');
} else {
	imageLoaderParams.push('bypassOnDebug');
}

var loaderImage = 'image?' + imageLoaderParams.join('&');

/* @todo
new webpack.DefinePlugin({
	'process.env.NODE_ENV': JSON.stringify('production')
}),
*/

var webpackBasicConfig = {
	output: {
		filename: '[name].js',
		path: buildPath,
		publicPath: '/'
	},
	module: {
		loaders: [
			{
				test: /\.jsx$/,
				loader: [loaderBabel, 'jsx-loader?stripTypes'].join('!')
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: loaderBabel
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract(loaderCSS)
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				loaders: [loaderImage]
			},
			{
				test: /\.styl$/,
				loader: ExtractTextPlugin.extract([loaderCSS, 'stylus-loader'].join('!'))
			}
		]
	},
	plugins: [
		new ExtractTextPlugin("[name].css")
	],
	resolve: {
		root: path.resolve(__dirname, 'src'),
		extensions: ['', '.js', '.jsx']
	}
}

if (isProduction) {
	webpackBasicConfig.plugins.push(
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.UglifyJsPlugin(
			{
				mangle: {
					screw_ie8: true
				},
				compress: {
					screw_ie8: true
				}
			}
		)
	);
} else {
	webpackBasicConfig.debug = true;
	webpackBasicConfig.devtool = '#source-map';
}

function buildBackground(watch) {
	var gulpWebpack = require('gulp-webpack');

	return gulp.src('src/background/index.js')
		.pipe(gulpWebpack(
			_.merge(_.clone(webpackBasicConfig), {
				watch: watch,
				output: {
					filename: 'background.js'
				}
			}), webpack
		))
		.pipe(gulp.dest('build/'));
}

gulp.task('background', function() {
	return buildBackground();
});

gulp.task('background:watch', function() {
	return buildBackground(true);
});

// options

function buildOptions(watch) {
	var gulpWebpack = require('gulp-webpack');

	return gulp.src('src/options/index.jsx')
		.pipe(gulpWebpack(
			_.merge(_.clone(webpackBasicConfig), {
				entry: {
					'index': 'options/index.jsx',
					'vendor': ['react', /*'react-router', */'normalize.stylus/index.styl']
				},
				watch: watch,
				output: {
					filename: 'index.js',
					path: path.resolve(buildPath, 'options'),
					publicPath: '/options/'
				},
				plugins: [
					new ExtractTextPlugin("[name].css"),
					new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
				]
			}), webpack
		))
		.pipe(gulp.dest('build/options'));
}

gulp.task('options:modules', function() {
	return buildOptions();
});

gulp.task('options:modules:watch', function() {
	return buildOptions(true);
});

gulp.task('options:templates', function() {
	return gulp.src('src/options/template.jade')
		.pipe(gulpJade({
			pretty: true
		}))
		.pipe(gulpRename('index.html'))
		.pipe(gulp.dest('build/options'));
});

gulp.task('options', ['options:templates', 'options:modules']);

// content scripts

function buildContentAuth(watch) {
	var gulpWebpack = require('gulp-webpack');

	return gulp.src('src/content/auth/index.js')
		.pipe(gulpWebpack(
			_.merge(_.clone(webpackBasicConfig), {
				watch: watch,
				output: {
					filename: 'index.js',
					path: path.resolve(buildPath, 'content/auth'),
				},
				plugins: [
					new ExtractTextPlugin("index.css")
				],
				debug: false,
				devtool: false
			}), webpack
		))
		.pipe(gulp.dest('build/content/auth'));
}

gulp.task('content:auth:modules', function() {
	return buildContentAuth();
});

gulp.task('content:auth:modules:watch', function() {
	return buildContentAuth(true);
});

gulp.task('content', ['content:auth:modules']);

// popup

function buildPopup(watch) {
	var gulpWebpack = require('gulp-webpack');

	return gulp.src('src/popup/index.jsx')
		.pipe(gulpWebpack(
			_.merge(_.clone(webpackBasicConfig), {
				entry: {
					'index': 'popup/index.jsx',
					'vendor': ['react', /*'react-router', */'normalize.stylus/index.styl']
				},
				watch: watch,
				output: {
					filename: 'index.js',
					path: path.resolve(buildPath, 'popup'),
					publicPath: '/popup/'
				},
				plugins: [
					new ExtractTextPlugin("[name].css"),
					new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
				]
			}), webpack
		))
		.pipe(gulp.dest('build/popup'));
}

gulp.task('popup:modules', function() {
	buildPopup();
});

gulp.task('popup:modules:watch', function() {
	buildPopup(true);
});

gulp.task('popup:templates', function() {
	return gulp.src('src/popup/template.jade')
		.pipe(gulpJade({
			pretty: true
		}))
		.pipe(gulpRename('index.html'))
		.pipe(gulp.dest('build/popup'));
});

gulp.task('popup:sprite', function() {
	var paths = _.map([
		'ei-plus.svg',
		'ei-spinner.svg',
		'ei-user.svg'
	], function(path) {
		return 'node_modules/evil-icons/assets/icons/' + path;
	} );

	return gulp.src(paths)
		.pipe(gulpSVG({
			mode: {
				css: {
					prefix: '%s',
					sprite: 'sprite.svg',
					dest: '',
					bust: false,
					render: {
						styl: true
					}
				}
			}
		}))
		.pipe(gulp.dest('src/vendor/evil-icons'));
});

gulp.task('popup', ['popup:templates', 'popup:sprite', 'popup:modules']);

// manifest

gulp.task('manifest', /*['i18n', 'build:mkdir'], */function(callback) {
	var targetPath = path.resolve(buildPath, 'manifest.json');

	var manifest = {
		manifest_version: 2,
		name: _.capitalize(packageInfo.name),
		version: packageInfo.version,
		minimum_chrome_version: '40',
		description: '__MSG_manifest_description__',
		default_locale: 'en',
		author: packageInfo.author,
		browser_action: {
			default_icon: {
				19: 'images/toolbar.png',
				38: 'images/toolbar@2x.png'
			},
			default_popup: 'popup/index.html'
		},
		background: {
			scripts: [
				'background.js'
			]
		},
		content_scripts: [
			{
				matches: [
					'https://api.twitter.com/oauth/authorize'
				],
				js: [
					'content/auth/index.js'
				],
				css: [
					'content/auth/index.css'
				]
			}
		],
		options_page: "options/index.html",
		permissions: [
			'storage',

			'https://api.twitter.com/1.1/*',
			'https://userstream.twitter.com/1.1/*',
			'https://twitter.com/oauth/*'
		]
	};

	fs.writeFile(targetPath, JSON.stringify(manifest, null, '  '), {}, callback);
});

// prepare vendors

gulp.task('vendor:twitter-text', function(callback) {
	var targetPath = path.resolve(__dirname, 'src/vendor/twitter-text.js');

	var content = [
		'/**',
		' * @preserve Many thanks to Twitter for their Twitter Text project',
		' *   https://github.com/twitter/twitter-text-js',
		' */',
		'var regexps = { };'
	];

	_.forEach({
		url: 'extractUrl',
		hash: 'validHashtag',
		mention: 'validMentionOrList'
	}, function(twitterTextRegexpName, regexpName) {
		var regexp = twitterText.regexen[twitterTextRegexpName];

		if (undefined === regexp) {
			throw new Error('Failed to find regexp ' + twitterTextRegexpName);
		}

		content.push(
			'regexps.' + regexpName + ' = ' + regexp + ';'
		);
	} );

	content.push('export default regexps;');

	fs.writeFile(targetPath, content.join('\n'), {}, callback);
});

gulp.task('i18n', function(callback) {
	return gulp.src('src/i18n/index.js', { read: false })
		.pipe(through.obj(function(file) {
			var translations = require(file.path);
			var filepath = path.dirname(file.path);
			var parsed = { };
			var self = this;

			function parse(data, prefix) {
				_.forEach(data, function(value, key) {
					var data;

					if (_.isPlainObject(value)) {
						parse(value, [prefix, key].filter(function(val) {
							return undefined !== val;
						}).join('_'));
					} else {
						if (undefined === parsed[key]) {
							parsed[key] = { };
						}

						if (_.isArray(value)) {
							data = {
								message: value[0],
								placeholders: { }
							};

							_.forEach(value[1], function(value, key) {
								data.placeholders[key] = {
									content: value
								};
							});
						} else {
							data = {
								message: value
							};
						}

						parsed[key][prefix] = data;
					}
				});
			}

			parse(translations);

			_.forEach(parsed, function(values, key) {
				var filename = path.resolve(filepath, key, 'messages.json');

				gutil.log(
					gutil.colors.cyan(path.relative(filepath, filename)) + ':',
					Object.keys(values).length, 'messages'
				);

				self.push(
					new gutil.File({
						base: filepath,
						path: filename,
						contents: new Buffer(JSON.stringify(values, null, '  '))
					})
				);
			});
		}))
		.pipe(gulp.dest('build/_locales'));
});

gulp.task('committers', function(callback) {
	var targetPath = path.resolve(__dirname, 'src/vendor/committers.js');

	child_process.exec('git shortlog -sne < /dev/tty', function(error, stdout) {
		if (!error) {
			var committers = [ ];

			stdout
				.replace(/^\s+|\s+$/g, '')
				.split('\n')
				.forEach(function(str) {
					var matches = str.split('\t')[1].match(/(.*?) <(.*?)>/);

					committers.push({
						name: matches[1],
						email: matches[2]
					});
				} );

			fs.writeFile(
				targetPath,
				'var committers = ' + JSON.stringify(committers) + ';\nexport default committers;',
				{},
				callback
			);
		} else {
			throw error;
		}
	});
});

gulp.task('vendor', ['vendor:twitter-text']);

gulp.task('build:cleanup', function(callback) {
	rimraf('build', callback);
});

gulp.task('build:mkdir', function(callback) {
	fs.exists(buildPath, function(exists) {
		if (!exists) {
			fs.mkdir(buildPath, callback);
		} else {
			callback();
		}
	});
});

gulp.task('build', [/*'cleanup', */'vendor', 'i18n', 'committers', 'manifest', 'popup', 'options', 'background']);

gulp.task('lint', function() {
	gulp.src('src/background/*.js')
		.pipe(gulpEslint({
			// @todo wait for normal es6 support
		}))
		.pipe(gulpEslint.format());
});

gulp.task('watch', ['background:watch', 'options:modules:watch', 'popup:modules:watch']);
