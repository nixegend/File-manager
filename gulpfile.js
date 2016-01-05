'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    cssAutoPrefixer = require('gulp-autoprefixer');

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

gulp.task('run', ['sass', 'watch:sass']); // default task