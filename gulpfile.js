'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    cssAutoPrefixer = require('gulp-autoprefixer');

var jasmineBrowser = require('gulp-jasmine-browser');
var jasmine = require('gulp-jasmine');

//======================================================

gulp.task('sass', function () {
  gulp.src('./sass/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssAutoPrefixer('last 5 versions'))
    .pipe(minifyCSS(''))
    .pipe(rename('styles.min.css'))
    .pipe(gulp.dest('./css/'));
});

gulp.task('watch:sass', function () {
  gulp.watch('./sass/parts/*.scss', ['sass']);
});

//======================================================

gulp.task('tests', function() {
  return gulp.src('./tests/test.js')
    .pipe(jasmine())
    .pipe(jasmineBrowser.specRunner())
    .pipe(jasmineBrowser.server({port: 8888}));
});

gulp.task('watch:tests', function () {
  gulp.watch('./tests/test.js', ['tests']);
});


//======================================================

gulp.task('default', ['sass', 'watch:sass', 'tests', 'watch:tests']);