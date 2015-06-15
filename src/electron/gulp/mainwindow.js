const path = require('path');

const gulpWebpack = require('gulp-webpack');
const gulpJade = require('gulp-jade');
const gulpRename = require('gulp-rename');
const webpack = require('webpack');

module.exports = function(gulp, config) {

	const targetPath = path.resolve(config.paths.build.electron, 'mainwindow');
	const webpackConfig = config.webpack();

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

	gulp.task('build:electron:mainwindow:content', function() {
		return gulp.src('src/electron/mainwindow/index.jsx')
			.pipe(gulpWebpack(webpackConfig, webpack))
			.pipe(gulp.dest(targetPath));
	});

	gulp.task('build:electron:mainwindow:html', function() {
		return gulp.src(path.resolve(config.paths.src, 'electron/mainwindow/index.jade'))
			.pipe(gulpJade({
				pretty: true,
				locals: {
					package: config.package
				}
			}))
			.pipe(gulpRename('index.html'))
			.pipe(gulp.dest(targetPath));
	});

	gulp.task(
		'build:electron:mainwindow',
		gulp.parallel(
			'build:electron:mainwindow:html',
			'build:electron:mainwindow:content'
		)
	);

};
