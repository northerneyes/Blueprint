var gulp = require('gulp'),
	config = require('./gulp/config'),
	browserSync = require('browser-sync'),
	clean = require('gulp-clean'),
	eslint = require('gulp-eslint'),
	concat = require('gulp-concat'),
	autoprefixer = require('gulp-autoprefixer'),
	browserifyTask = require('./gulp/tasks/browserify'),
	devMode = require('./gulp/config').devMode,
	reload = browserSync.reload,
	mocha = require('gulp-mocha'),
	browserify = require('gulp-browserify');

//clean
gulp.task('clean', function () {
	return gulp.src(config.dest + '/*', {
			read: false
		})
		.pipe(clean());
});

//browser sync
gulp.task('browserSync', function () {
	browserSync.init(config.browserSync);
});

//Css
gulp.task('css', function () {
	gulp.src(config.vendor_styles)
		.pipe(concat('vendor.css'))
		.pipe(gulp.dest(config.dest_css));

	gulp.src(config.src_css)
		.pipe(concat('app.css'))
		.pipe(autoprefixer())
		.pipe(gulp.dest(config.dest_css))
		.pipe(reload({
			stream: true
		}));
});

//JSHint
gulp.task('lint', function () {
	gulp.src(config.src_scripts)
		.pipe(eslint())
		.pipe(eslint.format());
});

//Copy fonts
gulp.task('fonts', function () {
	gulp.src(config.src_fonts)
		.pipe(gulp.dest(config.dest_fonts))
		.pipe(reload({
			stream: true
		}));
});

//Copy html
gulp.task('views', function () {
	gulp.src(config.src_views)
		.pipe(gulp.dest(config.dist + '/'))
		.pipe(reload({
			stream: true
		}));
});

//watch all of this
gulp.task('watchify', function (callback) {
	browserifyTask(callback, devMode);
});

gulp.task('test', function (cb) {
	//es6 harmony
	require('mocha-traceur');

	gulp.src('./tests/*.js')
		.pipe(mocha({reporter: 'spec'}));
});

gulp.task('watch', ['lint', 'views', 'css', 'fonts', 'watchify', 'browserSync'], function () {
	gulp.watch(config.src_fonts, ['fonts']);
	// gulp.watch(config.src_views, ['views']);
	// gulp.watch(config.src_img, ['img']);
	gulp.watch(config.src_css, ['css']);
	// gulp.watch(config.src_scripts, ['lint', 'js']);
});

gulp.task('default', ['watch']);