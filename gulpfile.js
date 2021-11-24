/**
 * NPM modules 
 */
const color = require('chalk')
/**
 * Gulp modules 
 */
const gulp = require('gulp')

gulp.task('start', (cb) => {
  console.log(color.green('[gulp][task][start]')) // !DEBUG
  cb()
})