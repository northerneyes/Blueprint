'use strict';

var gulp = require('gulp');

var browserify = require('browserify');
var browserSync = require('browser-sync');
var watchify = require('watchify');
var bundleLogger = require('../util/bundleLogger');

var handleErrors = require('../util/handleErrors');
var source = require('vinyl-source-stream');
var config = require('../config').browserify;
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var _ = require('lodash');

var browserifyTask = function (callback, devMode) {

  var bundleQueue = config.bundleConfigs.length;

  var browserifyThis = function (bundleConfig) {

    // Add watchify args and debug (sourcemaps) option
    if (devMode) {
      _.extend(bundleConfig, watchify.args, {
        debug: bundleConfig.sourcemap
      });

      // A watchify require/external bug that prevents proper recompiling,
      // so (for now) we'll ignore these options during development
      //  bundleConfig = _.omit(bundleConfig, ['external', 'require'])
    }

    var b = browserify(bundleConfig);

    var bundle = function () {
      // Log when bundling starts
      bundleLogger.start(bundleConfig.outputName);
      if (devMode) {
        return b
          .bundle()
          .on('error', handleErrors)
          .pipe(source(bundleConfig.outputName))

        .pipe(gulp.dest(bundleConfig.dest))
          .on('end', reportFinished)
          .pipe(browserSync.reload({
            stream: true
          }));
      }
      return b
        .bundle()
        // Report compile errors
        .on('error', handleErrors)
        // Use vinyl-source-stream to make the
        // stream gulp compatible. Specify the
        // desired output filename here.
        .pipe(source(bundleConfig.outputName))
        // Specify the output destination
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest(bundleConfig.dest))
        .on('end', reportFinished)
        .pipe(browserSync.reload({
          stream: true
        }));
    };

    if (devMode) {
      // Wrap with watchify and rebundle on changes
      b = watchify(b);
      // Rebundle on update
      b.on('update', bundle);
      bundleLogger.watch(bundleConfig.outputName);
    }
    //} else {
    // Sort out shared dependencies.
    // b.require exposes modules externally
    if (bundleConfig.require) b.require(bundleConfig.require);
      // b.external excludes modules from the bundle, and expects
      // they'll be available externally
    if (bundleConfig.external) b.external(bundleConfig.external);
      //}

    var reportFinished = function () {
      // Log when bundling completes
      bundleLogger.end(bundleConfig.outputName);

      if (bundleQueue) {
        bundleQueue--;
        if (bundleQueue === 0) {
          // If queue is empty, tell gulp the task is complete.
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#accept-a-callback
          callback();
        }
      }
    };

    return bundle();
  };

  // Start bundling with Browserify for each bundleConfig specified
  config.bundleConfigs.forEach(browserifyThis);
};

gulp.task('browserify', browserifyTask);

// Exporting the task so we can call it directly in our watch task, with the 'devMode' option
module.exports = browserifyTask;