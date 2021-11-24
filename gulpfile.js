/**
 * * Node modules 
 */
const path = require('path')
const fs = require('fs')

/**
 * * NPM modules 
 */
const color = require('chalk')

/**
 * * Gulp modules 
 */
const gulp = require('gulp')
const argv = require('minimist')(process.argv.slice(2))
const { src, dest } = require('gulp')
const replace = require('gulp-replace')
const clean = require('gulp-clean')

/**
 * * Variables 
 */
// output directory
// cmd => gulp myTaskName --root 'myDirectoryName'
const outputDir = argv.root || 'dist' // default

const log = () => {
  if (argv.root) {
    console.log(color.bgYellow.black(`[GULP][default][dest][.${path.sep}${argv.root}]`)) // !DEBUG
  } else {
    console.log(color.bgYellow.black(`[GULP][default][dest][.${path.sep}dist]`)) // !DEBUG
  }
}

log()

// app paths
const paths = {
  html: {
    src: [path.join('.', '*.html')],
    dest: [path.join('.', outputDir)],
  },
  css: {
    src: [path.join('.', 'src', 'css', '*.css')],
    dest: [path.join('.', outputDir, 'css')],
  },
  js: {
    src: [path.join('.', 'src', 'js', '*.js')],
    dest: [path.join('.', outputDir, 'js')],
  },
  cachebust: {
    src: [path.join('.', outputDir, '*.html')],
    dest: [path.join('.', outputDir)]
  }
}
/**
 * * GULP TASKS
 */
gulp.task('start', (cb) => {
  console.log(color.green('[gulp][task][start]')) // !DEBUG
  cb()
})

/**
 * * Clean default or custom output directory
 * cmd => gulp clean
 * cmd => gulp clean --root 'myDirectoryName'
 */
gulp.task('clean', done => {
  const dir = path.join('.', outputDir)
    // check if given output directory exists
  if (fs.existsSync(dir)) {
    console.log(color.green(`[clean][.${path.sep}${dir}][exists]`))
    return src(path.join('.', outputDir), {read: false})
    .pipe(clean())
  } else {
    console.log(color.yellow(`[clean][exit][No such directory][.${path.sep}${dir}]`))
    done()
  }
})

/**
 * * Copy .html file to output directory
 */
gulp.task('html', () => {
  return src(paths.html.src).pipe(dest(paths.html.dest))
})

/**
 * * Copy .css file to output directory
 */
gulp.task('css', () => {
  return src(paths.css.src).pipe(dest(paths.css.dest))
})

/**
 * * Copy .js file to output directory
 */
gulp.task('js', () => {
  return src(paths.js.src).pipe(dest(paths.js.dest))
})

/**
 * * Cache busting
 * For cache bust, include 'chache_bust' parameter with any number to all styles and scripts links
 * For e.g. -
 * <link rel="stylesheet" href="/dist/css/style.min.css?cache_bust=123" />
 * <script src="/dist/js/script.min.js?cache_bust=123"></script>
 */
gulp.task('cacheBust', () => {
  const hash = new Date().getTime()
  console.log(color.green(`[cacheBust][hash][${hash}]`)) // !DEBUG
  return src(paths.cachebust.src)
    .pipe(replace(/cache_bust=\d+/g, `cache_bust=${hash}`))
    .pipe(dest(paths.cachebust.dest))
})


/**
 * * Tasks series
 * cmd => gulp build
 * cmd => gulp build --root 'myDirectoryName'
 */
 gulp.task('build', gulp.series('clean', 'html', 'css', 'js', 'cacheBust'))
