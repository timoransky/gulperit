var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    minifycss = require('gulp-clean-css'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync')
    wait = require('gulp-wait2');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('bs-reload', function() {
    browserSync.reload();
});

gulp.task('images', function() {
    return gulp.src('assets/_src/img/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest('assets/img/'));
});

gulp.task('styles', function() {
    return gulp.src(['assets/_src/sass/**/*.scss'])
        .pipe(wait(1000))
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer('last 4 versions'))
        .pipe(gulp.dest('assets/css/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('assets/css/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('scripts', function() {
    return gulp.src('assets/_src/js/**/*.js')
        .pipe(wait(1000))
        .pipe(plumber({
            errorHandler: function(error) {
                console.log(error.message);
                this.emit('end');
            }
        }))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('assets/js/'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('default', ['styles', 'scripts', 'images', 'browser-sync'], function() {
    gulp.watch("assets/_src/sass/**/*.scss", ['styles']);
    gulp.watch("assets/_src/js/**/*.js", ['scripts']);
    gulp.watch("assets/_src/img/**/*.jpg", ['images']);
    gulp.watch("assets/_src/img/**/*.png", ['images']);
    gulp.watch("assets/_src/img/**/*.svg", ['images']);
    gulp.watch("*.html", ['bs-reload']);
});
