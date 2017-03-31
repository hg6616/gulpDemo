var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    watch = require('gulp-watch'),
    browserSync = require('browser-sync'),
    // 控制任务顺序``
    runSequence = require('gulp-sequence'),
    htmlmin = require('htmlmin')
var reload = browserSync.reload;

var devPath = 'dev/';
var distPath = 'dist/';
var devFilePath = {
    css: devPath + 'css/**/*.css',//匹配所有子目录是两个*号
    js: devPath + 'js/**/*.js',
    image: devPath + 'image/**/*.*',
    html: devPath + 'html/**/*.html'
};
var htmlminiOptions = {
    // collapseWhitespace: true,
    // collapseBooleanAttributes: true,
    // removeComments: true,
    // removeEmptyAttributes: true,
    // removeScriptTypeAttributes: true,
    // removeStyleLinkTypeAttributes: true,
    jsmin: true,
    cssmin: true
};
gulp.task('dev', ['clean-dist'], function () {
    //return;
    browserSync({
        server: {
            baseDir: distPath,
            index: 'html/index.html'
        }
        //或者代理一个服务器
        //proxy: "127.0.0.1:8080" 替代server键值对，不是baseDir!!!!。
    });
    gulp.watch(devFilePath.css, ['minifycss']);
    gulp.watch(devFilePath.js, ['minifyjs']);
    gulp.watch(devFilePath.image, ['moveImage']);
    gulp.watch(devFilePath.html, ['minifyhtml']);
    //gulp.watch([devFilePath.html, devFilePath+'*.html'], ['dev-html'])
})
//
//语法检查
gulp.task('jshint', function () {
    return gulp.src(devFilePath.js)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
//压缩css
gulp.task('minifycss', function () {
    return gulp.src(devFilePath.css)    //需要操作的文件
        .pipe(watch(devFilePath.css, {
            ignoreInitial: false
        }))
        // .pipe(rename({ suffix: '.min' }))   //rename压缩后的文件名
        .pipe(minifycss())   //执行压缩
        .pipe(gulp.dest(distPath + 'css'))
        .pipe(reload({
            stream: true
        }));   //输出文件夹
});
//压缩，合并 js
gulp.task('minifyjs', function () {
    return gulp.src(devFilePath.js)      //需要操作的文件
        .pipe(concat('main.js'))    //合并所有js到main.js
        .pipe(gulp.dest('temp'))       //输出到文件夹
        // .pipe(rename({ suffix: '.min' }))   //rename压缩后的文件名
        .pipe(uglify())    //压缩
        .pipe(gulp.dest(distPath + 'Js'))
        .pipe(reload({
            stream: true
        }));  //输出
});
//压缩html
gulp.task('minifyhtml', function () {
    return gulp.src(devFilePath.html)      //需要操作的文件
        .pipe(watch(devFilePath.html, {
            ignoreInitial: false
        }))
       // .pipe(htmlmin({ cssmin: true}))    //压缩
        .pipe(gulp.dest(distPath + 'html'))
        .pipe(reload({
            stream: true
        }));
});
//移动图片
gulp.task('moveImage', function () {
    return gulp.src(devFilePath.image)      //需要操作的文件
        .pipe(watch(devFilePath.image, {
            ignoreInitial: false
        }))
        .pipe(gulp.dest(distPath + 'image'))
        .pipe(reload({
            stream: true
        }));  //输出
});

// 清空 dist 目录
gulp.task('clean-dist', function () {
    return gulp.src(distPath, { read: false })
        .pipe(clean({ force: true }))
})
　　//默认命令，在cmd中输入gulp后，执行的就是这个任务(压缩js需要在检查js之后操作)
// gulp.task('default', ['jshint'], function () {
//     gulp.start('clean-dist', 'minifycss', 'minifyjs');
// 　　});


gulp.task('default', runSequence('dev', 'jshint', ['minifycss', 'minifyjs', 'minifyhtml', 'moveImage']));
