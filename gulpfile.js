var gulp = require('gulp');
var sass = require('gulp-sass')(require('node-sass'));

gulp.task('sass', function(cb) {
  gulp
    .src('*.scss')
    .pipe(sass())
    .pipe(
      gulp.dest(function(f) {
        //return f.base;
        return "./styles";
      })
    );
  cb();
});

gulp.task(
  'default',
  gulp.series('sass', function(cb) {
    gulp.watch('*.scss', gulp.series('sass'));
    cb();
  })
);