'use strict';

var gulp = require('gulp');
var browserifyTask = require('./browserify');
var devMode = require('../config').devMode;

gulp.task('watchify', function (callback) {
	browserifyTask(callback, devMode);
});