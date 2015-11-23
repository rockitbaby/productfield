var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    ftp = require('gulp-ftp'),
    rename = require('gulp-rename'),
    handlebars = require('gulp-compile-handlebars'),
    mainBowerFiles = require('main-bower-files'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    rename = require('gulp-rename'),
    mdhbs = require('./gulp/markdown-handlebars'),
    cachebust = require('gulp-cache-bust'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps')
    ;


gulp.task('build', function(cb) {
  gulp.start('copy-assets');
  gulp.start('build-templates');
  gulp.start('build-styles');
  gulp.start('build-bower-files');
  gulp.start('build-forcefield');
  setTimeout(cb, 100);
});

gulp.task('dist', function(cb) {
  gulp.start('build');
  gulp.start('copy-dist');
  gulp.start('cachebust-html');
  setTimeout(cb, 100);
});

gulp.task('deploy-beta', function() {

  var ftpConfig = require('./.ftp-deploy.json');

  return gulp.src('public/**/*')
    .pipe(ftp({
        host: ftpConfig.beta.host,
        user: ftpConfig.beta.username,
        pass: ftpConfig.beta.password
    }))
    // you need to have some kind of stream after gulp-ftp to make sure it's flushed 
    // this can be a gulp plugin, gulp.dest, or any kind of stream 
    // here we use a passthrough stream 
    .pipe(gutil.noop());
});

gulp.task('deploy-production', function() {

  var ftpConfig = require('./.ftp-deploy.json');

  return gulp.src('dist/**/*')
    .pipe(ftp({
        host: ftpConfig.production.host,
        user: ftpConfig.production.username,
        pass: ftpConfig.production.password
    }))
    // you need to have some kind of stream after gulp-ftp to make sure it's flushed 
    // this can be a gulp plugin, gulp.dest, or any kind of stream 
    // here we use a passthrough stream 
    .pipe(gutil.noop());
});

gulp.task("build-bower-files", function(){
    gulp.src(mainBowerFiles())
      .pipe(gulp.dest("./public/assets"));
});

gulp.task('copy-assets', function() {
  gulp.src('./assets/**/*')
    .pipe(gulp.dest('./public/assets'))
});


gulp.task('build-styles', function() {
  gulp.src('./src/productfield.styl')
    .pipe(stylus({use: nib()}))
    .pipe(rename('productfield.css'))
    .pipe(gulp.dest('./public/assets/style'))
});

gulp.task('copy-dist', function() {
  gulp.src('./public/assets/**/*')
    .pipe(gulp.dest('./dist/assets'))
});

gulp.task('build-forcefield', function() {
  return gulp.src([
      './src/script/forcefield/forcefield.js',
      './src/script/forcefield/energy.js',
      './src/script/forcefield/gridmarker.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('forcefield.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/assets/forcefield'));
});

gulp.task('cachebust-html', function() {
  gulp.src('./public/*.html')
    .pipe(cachebust({
        type: 'timestamp'
    }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('build-templates', function() {

  var partials = {};
  partials = mdhbs('./src/content');

  var options = {
      ignorePartials: true, //ignores the unknown footer2 partial in the handlebars template, defaults to false 
      partials : partials,
      batch : ['./src/partials'],
      helpers : {
          capitals : function(str){
              return str.toUpperCase();
          }
      }
  }
  gulp.src('./src/*.hbs')
    .pipe(handlebars({}, options))
    .pipe(rename({extname: '.html'}))
    .pipe(gulp.dest('./public/'))
});

gulp.task('serve', function() {
  connect.server({
    root: './public',
    livereload: true
  });
});

gulp.task('reload', function() {
  gulp.src('./public/*.html')
    .pipe(connect.reload());
});


gulp.task('dev', ['serve', 'watch'], function() {});

gulp.task('watch', function() {

  gulp.watch(['./src/**'], ['build', 'reload']);
  //gulp.watch('./public/**').pipe(connect.reload());
  
  /*
  var watchthese = ['./src/**'];
  gulp.src(watchthese)
    .pipe(plug.watch(
      watchthese,
      {},
      buildAndReload));
  */
});