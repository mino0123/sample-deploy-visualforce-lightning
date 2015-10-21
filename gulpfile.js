const fs = require('fs');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const zip = require('gulp-zip');
const browserify = require('browserify');
const watchify = require('watchify');
const assign = require('lodash.assign');
const gutil = require('gulp-util');
const file = require('gulp-file');
const through = require('through2');

const packagexml = require('./tasks/lib/object2packagexml');
const deploy = require('./tasks/deploy');

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
  const apiversion = '35.0';


  const sldsMeta = require('./tasks/resource-meta')('application/zip');

  const resourceBody = fs.readFileSync('./build/bundle.js', 'utf-8');
  const resourceMeta = require('./tasks/resource-meta')('application/javascript');

  const pageBody = require('./tasks/visualforce')(pagename);
  const pageMeta = require('./tasks/page-meta')(pagename, apiversion);

  const ltng = require('./tasks/lightning')(pagename);
  const ltngComponent = ltng.component;
  const ltngController = ltng.controller;

  const packxml = packagexml({
    version: apiversion,
    types: [
      {name: 'ApexPage', members: [pagename]},
      {name: 'StaticResource', members: ['*']},
      {name: 'AuraDefinitionBundle', members: ['*']}
    ]
  });

  // through.obj()
  gulp.src('node_modules/@salesforce-ux/design-system/assets/**/*')
    .pipe(zip('pkg/staticresources/SLDS.resource'))
    .pipe(file(`pkg/staticresources/SLDS.resource-meta.xml`, sldsMeta))
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
    // .pipe(gulp.dest('./tmp'))
    .pipe(deploy({
      username: process.env.SF_USERNAME,
      password: process.env.SF_PASSWORD,
      deploy: { rollbackOnError: true }
    }))
    .on('error', (err) => {
      cb(err);
    });
});
