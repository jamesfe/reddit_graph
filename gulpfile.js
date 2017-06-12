var gulp = require('gulp');
var jshint = require('gulp-jshint');

gulp.task('default', function() {
  return gulp.src('./src/linegraph.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

var webserver = require('gulp-webserver');

gulp.task('webserver', function() {
    gulp.src('./')
      .pipe(webserver({
              livereload: true,
              directoryListing: true,
              open: false
            }));
});

