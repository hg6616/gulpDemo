/**
 * Created by ly-yangqingcong on 2016/9/8.
 */
var gulp = require('gulp');
// 只对修改的文件进行处理
const watch = require('gulp-watch')
// 调试
var sourcemaps = require('gulp-sourcemaps')
// css 预处理器
var sass = require('gulp-sass')
// css 后处理器
var postcss = require('gulp-postcss')
// 自动添加浏览器厂商前缀
var autoprefixer = require('autoprefixer')
// 静态服务器
var browserSync = require('browser-sync')
// html 公共部分复用
var fileinclude = require('gulp-file-include')
// 执行 shell 命令模块
const exec = require('child_process').exec
// 清除文件插件
const clean = require('gulp-clean')
// 控制任务顺序``
const runSequence = require('gulp-sequence')
// 执行出错不跳出
//const plumber = require('gulp-plumber')

// 定义一些目录的变量，方便修改
// 源文件目录
var sourceFile = {
  // scss 文件
  style: ['src/style/**/*.scss', 'src/style/*.scss'],
  // html 文件
  html: 'src/*.html',
  // 图片文件
  image: ['src/images/*.png', 'src/images/*.jpg','src/images/*.gif'],
  //不用再编译的CSS文件
  static: ['src/static/*.css','src/static/**/*.css','src/static/**/*.png','src/static/**/*.gif'],
  //js文件
  js:['src/js/*.js','src/js/**/*.js','src/js/*/*.swf','src/js/**/**/*.js'],
  //fonts文件夹
  fonts:'src/fonts/*.*'
};

// 输出目录
var destPath='../Portal.Web/';
var distFile = {
  dir: '../Portal.Web/Pages',
  // 样式
  css: '../Portal.Web/Pages/css',
  // image
  image: '../Portal.Web/Pages/images',
  //js
  js:'../Portal.Web/Pages/js',
  //fonts
  fonts:'../Portal.Web/Pages/fonts'
};
// 静态服务器目录
var serverDir = '../Portal.Web/Pages/';

//var browserSync = browsersync.create()
var reload = browserSync.reload
gulp.task('dev', ['clean-dist', 'clean-read-only'], function () {
  browserSync({
    server: {
      baseDir: serverDir
    }
   //或者代理一个服务器
   //proxy: "127.0.0.1:8080" 替代server键值对，不是baseDir!!!!。
  });
  gulp.watch(sourceFile.style, ['dev-css']);
  gulp.watch([sourceFile.html, 'src/public/*.html'], ['dev-html'])
})

// 编译sass到css
gulp.task('dev-css', function () {
  return gulp.src(sourceFile.style)
    .pipe(watch(sourceFile.style, {
      ignoreInitial: false
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(postcss([autoprefixer]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(distFile.css))
    .pipe(reload({
      stream: true 
    }));
});

// html 处理
gulp.task('dev-html', function () {
  return gulp.src(['src/*.html', 'src/**/*.html', '!src/public/*.html'])
    .pipe(watch(['src/*.html', 'src/**/*.html', '!src/public/*.html'], {
      ignoreInitial: false
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('../Portal.Web/Pages'))
    .pipe(reload({
      stream: true
    }))
})

// 移动 src 图片文件到 dist 文件夹
gulp.task('move-image', function () {
  return gulp.src(sourceFile.image)
    .pipe(watch(sourceFile.image, {
      ignoreInitial: false
    }))
    .pipe(gulp.dest(distFile.image))
    .pipe(reload({
      stream: true
    }))
})
gulp.task('move-js', function () {
  return gulp.src(sourceFile.js)
    .pipe(watch(sourceFile.js, {
      ignoreInitial: false
    }))
    .pipe(gulp.dest(distFile.js))
    .pipe(reload({
      stream: true
  }))
})
gulp.task('move-static', function () {
    return gulp.src(sourceFile.static)
            .pipe(watch(sourceFile.static, {
                ignoreInitial: false
            }))
            .pipe(gulp.dest(distFile.css))
            .pipe(reload({
                stream: true
            }))
})
gulp.task('move-fonts', function () {
  return gulp.src(sourceFile.fonts)
      .pipe(watch(sourceFile.fonts, {
        ignoreInitial: false
      }))
      .pipe(gulp.dest(distFile.fonts))
      .pipe(reload({
        stream: true
      }))
});
// 监听图片文件
//gulp.watch(sourceFile.image, ['move-image'])

// 前置任务，用来改变文件夹权限
gulp.task('clean-read-only', function (cb) {
  exec('attrib -r src/* /s /d')
  // 要可以从上面执行得到结果，如果是错误，就传给回调，表示这次任务失败。
  cb(null)
})
// 清空 dist 目录
gulp.task('clean-dist', function () {
  return gulp.src(distFile.dir, {read: false})
    .pipe(clean({force: true}))
})


gulp.task('default', runSequence('dev', ['dev-css', 'dev-html', 'move-image', 'move-js','move-static','move-fonts']));

//gulp.task('build', ['clean-dist', 'dev-css', 'dev-html', 'move-image']);
gulp.task('build', runSequence('clean-dist', 'clean-read-only', ['dev-css', 'dev-html', 'move-image', 'move-js','move-static','move-fonts']))