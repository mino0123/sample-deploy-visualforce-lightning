const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const zip = require('gulp-zip');
const forceDeploy = require('gulp-jsforce-deploy');
const browserify = require('browserify');
const watchify = require('watchify');
const assign = require('lodash.assign');
const gutil = require('gulp-util');

// gulp.task('build', () => {
//   browserify({
//     entries: ['src/js/app.js']
//   })
//   .bundle()
//   .pipe(source('bundle.js'))
//   .pipe(gulp.dest("build"))
// });

var opts = assign({}, watchify.args, {
  entries: ['./src/js/app.js'],
  debug: true
});
var b = watchify(browserify(opts)); 

gulp.task('build', bundle);
b.on('update', bundle);
b.on('log', gutil.log);

function bundle() {
  b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'));
}

gulp.task('deploy', () => {
  gulp.src('./pkg/**', { base: "." })
    .pipe(zip('pkg.zip'))
    .pipe(forceDeploy({
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD
    }));
});
