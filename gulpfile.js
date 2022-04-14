const {src, dest, series, watch} = require('gulp');
const del = require('del');
const squoosh = require('gulp-squoosh');
const cachebust = require('gulp-cache-bust');
const sync = require('browser-sync').create();
const emailTools = require('gulp-email-tools');

const sourceFolder = 'source';
const buildFolder = 'build';

function html() {
  return src([sourceFolder + '/**.html'])
    .pipe(cachebust({type: 'timestamp'}))
    .pipe(emailTools())
    .pipe(dest(buildFolder))
};

function png() {
  return src([
    sourceFolder + "/img/*.png"
  ])
  .pipe(
    squoosh(() => ({
      encodeOptions: {
        oxipng: { quality: 85 },
      },
    }))
  )
  .pipe(dest(buildFolder + "/img"));
};

function jpg() {
  return src([
    sourceFolder + "/img/*.jpg"
  ])
  .pipe(
    squoosh(() => ({
      encodeOptions: {
        mozjpeg: { quality: 85 },
      },
    }))
  )
  .pipe(dest(buildFolder + "/img"));
};

function clear() {
  return del(buildFolder)
};

function serve() {
  sync.init({
    port: 3010,
    reloadOnRestart: true,
    server: {
      baseDir: buildFolder,
      directory: true
    }
  });

  watch(sourceFolder + '/*.html', series(html)).on('change', sync.reload)
  watch(sourceFolder + '/*', series(png,jpg)).on('change', sync.reload)
};


exports.build = series(clear, png,jpg, html);
exports.watch = series(clear, png,jpg, html, serve);
exports.clear = clear;