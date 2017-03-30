var gulp = require('gulp'),
minifycss=require('gulp-minify-css'),
concat=require('gulp-concat'),
uglify=require('gulp-uglify'),
rename=require('gulp-rename'),
jshint=require('gulp-jshint');

//语法检查
gulp.task('jshint',function(){
    return gulp.src('js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
//压缩css
gulp.task('minifycss',function(){
    return gulp.src('css/*.css')
    .pipe(rename({suffix:'.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('cssmini'));
});
//压缩合并js
gulp.task('minifyjs',function(){
    return gulp.src('js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('jsmin'))
    .pipe(rename({suffix:'.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('jsmin2'));
});


gulp.task('default',['jshint'] ,function() {

 console.log('hello gulp');
  // 将你的默认的任务代码放在这
  gulp.start('minifycss','minifyjs');
});