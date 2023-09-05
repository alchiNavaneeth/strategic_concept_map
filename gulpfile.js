const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();

function compileSass() {
  return gulp.src('src/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}

function watchFiles() {

    browserSync.init({
        server: {
            baseDir: './src'
        },
        port: 5000
    });

    gulp.watch('src/**/*.scss', compileSass).on('change', browserSync.reload);
    gulp.watch('src/*.html').on('change', browserSync.reload);
    gulp.watch('src/**/*.js').on('change', browserSync.reload);
    gulp.watch('src/**/*.json').on('change', browserSync.reload);
}

exports.default = gulp.series(compileSass, watchFiles);