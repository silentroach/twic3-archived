const path = require('path');

const gulpWebpack = require('webpack-stream');
const gulpJade = require('gulp-jade');
const gulpRename = require('gulp-rename');
const webpack = require('webpack');

module.exports = function(gulp, config) {

	const targetPath = path.resolve(config.paths.build.electron, 'mainwindow');

	const htmlSourcePath = path.resolve(config.paths.src, 'electron/mainwindow/index.jade');

	function getWebpackConfig(isWatch = false) {
		const webpackConfig = config.webpack({
			watch: isWatch
		});

		webpackConfig.entry = {
			'index': 'mainwindow/index.jsx',
			'vendor': [
				'vendor/babel-helpers',
				'react',
				'react-pure-render/component',
				'moment',
				'normalize.stylus/index.styl'
			]
		};

		webpackConfig.output = {
			filename: 'index.js',
			path: targetPath,
			publicPath: '/mainwindow/'
		};

		webpackConfig.resolve = {
			root: [
				path.resolve(config.paths.src, 'electron'),
				path.resolve(config.paths.src, 'base')
			],
			extensions: ['', '.js', '.jsx']
		};

		return webpackConfig;
	}

	gulp.task('build:electron:mainwindow:content', function() {
		return gulp.src('src/electron/mainwindow/index.jsx')
			.pipe(gulpWebpack(getWebpackConfig(), webpack))
			.pipe(gulp.dest(targetPath));
	});

	gulp.task('watch:electron:mainwindow:content', function() {
		return gulp.src('src/electron/mainwindow/index.jsx')
			.pipe(gulpWebpack(getWebpackConfig(true), webpack))
			.pipe(gulp.dest(targetPath));
	});

	gulp.task('build:electron:mainwindow:html', function() {
		return gulp.src(htmlSourcePath)
			.pipe(gulpJade({
				pretty: true,
				locals: {
					package: config.package
				}
			}))
			.pipe(gulpRename('index.html'))
			.pipe(gulp.dest(targetPath));
	});

	gulp.task('watch:electron:mainwindow:html', function() {
		gulp.watch(htmlSourcePath, gulp.task('build:electron:mainwindow:html'));
	});

	gulp.task(
		'build:electron:mainwindow',
		gulp.parallel(
			'build:electron:mainwindow:html',
			'build:electron:mainwindow:content'
		)
	);

	gulp.task(
		'watch:electron:mainwindow',
		gulp.parallel(
			'watch:electron:mainwindow:content',
			'watch:electron:mainwindow:html'
		)
	);

};
