var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    cache = require('gulp-cache'),
    refresh = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();


// Server
gulp.task('lr-server', function() {
  server.listen(35729, function(err) {
    if(err) return console.log(err);
  });
});


// Styles
gulp.task('styles', function() {
  gulp.src(['src/styles/app.less'])
      .pipe(less())
      .pipe(autoprefixer(
          'last 2 version',
          'safari 5',
          'ie 8', 'ie 9',
          'opera 12.1',
          'ios 6', 'android 4')
      )
      .pipe(minifycss())
      .pipe(refresh(server))
      .pipe(gulp.dest('build/css'))
});

// Images
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
      .pipe(cache(imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true }))
      )
      .pipe(refresh(server))
      .pipe(gulp.dest('build/img'))
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
      .pipe(uglify())
      .pipe(refresh(server))
      .pipe(gulp.dest('build/js'))
});


// Run tasks
gulp.task('default', function() {

  gulp.run('lr-server', 'styles', 'images', 'scripts');

  gulp.watch('src/styles/**', function(ev) {
    console.log('File ' + ev.path + ' was ' + ev.type + ', running tasks...');
    gulp.run('styles');
  });

  gulp.watch('src/img/**/*', function(ev) {
    console.log('File ' + ev.path + ' was ' + ev.type + ', running tasks...');
    gulp.run('images');
  });

  gulp.watch('src/js/**/*', function(ev) {
    console.log('File ' + ev.path + ' was ' + ev.type + ', running tasks...');
    gulp.run('scripts');
  });
});