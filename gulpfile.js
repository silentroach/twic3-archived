var _ = require('lodash');
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var gulpJade = require('gulp-jade');
var gulpSVG = require('gulp-svg-sprite');
var gulpRename = require('gulp-rename');

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
};

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

gulp.task('build', [/*'cleanup', */'vendor', 'i18n', 'contributors', 'manifest', 'popup', 'options', 'background']);

gulp.task('watch', ['background:watch', 'options:modules:watch', 'popup:modules:watch']);

require('./gulp/i18n');
require('./gulp/lint');
require('./gulp/vendor');
