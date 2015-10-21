const fs = require('fs');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const zip = require('gulp-zip');
const forceDeploy = require('gulp-jsforce-deploy');
const browserify = require('browserify');
const watchify = require('watchify');
const assign = require('lodash.assign');
const gutil = require('gulp-util');
const rereplace = require('gulp-regex-replace');

const file = require('gulp-file');
const through = require('through2');

const packagexml = require('./tasks/lib/object2packagexml');
const deploy = require('./tasks/deploy');

// gulp.task('build', () => {
//   browserify({
//     entries: ['src/js/app.js']
//   })
//   .bundle()
//   .pipe(source('bundle.js'))
//   .pipe(gulp.dest("build"))
// });

const opts = assign({}, watchify.args, {
  entries: ['./src/js/app.js'],
  // debug: true
});
const b = watchify(browserify(opts)); 
b.on('update', bundle);
b.on('log', gutil.log);
gulp.task('build', bundle);

function bundle() {
  b.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    // .pipe(sourcemaps.init({loadMaps: true}))
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./build'));
}

gulp.task('pack', () => {

  const pagename = 'MyPage';

  const resourceBody = fs.readFileSync('./build/bundle.js', 'utf-8');
  const resourceMeta = require('./tasks/resource-meta')('application/javascript');

  const pageBody = require('./tasks/visualforce')(pagename);
  const pageMeta = require('./tasks/page-meta')(pagename, '34.0');

  const ltng = require('./tasks/lightning')(pagename);
  const ltngComponent = ltng.component;
  const ltngController = ltng.controller;

  const packxml = packagexml({
    version: '34.0',
    types: [
      {name: 'ApexPage', members: [pagename]},
      {name: 'StaticResource', members: [pagename]},
      {name: 'AuraDefinitionBundle', members: ['*']}
    ]
  });

  through.obj()
    .pipe(file('pkg/package.xml', packxml))
    .pipe(file(`pkg/staticresources/${pagename}.resource`, resourceBody))
    .pipe(file(`pkg/staticresources/${pagename}.resource-meta.xml`, resourceMeta))
    .pipe(file(`pkg/pages/${pagename}.page`, pageBody))
    .pipe(file(`pkg/pages/${pagename}.page-meta.xml`, pageMeta))
    .pipe(file(`pkg/aura/${pagename}/${pagename}.cmp`, ltngComponent))
    .pipe(file(`pkg/aura/${pagename}/${pagename}Controller.js`, ltngController))
    .pipe(gulp.dest('.'));
});


gulp.task('deploy', (cb) => {
  gulp
    .src('pkg/**', { base: '.' })
    .pipe(zip('pkg.zip'))
    .pipe(deploy({
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD,
      deploy: { rollbackOnError: true }
    }))
    .pipe(gulp.dest('./tmp'))
    .on('error', (err) => {
      cb(err);
    });
});
