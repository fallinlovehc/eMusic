var gulp = require('gulp'),
	childProcess = require('child_process'),
	electron = require('electron-prebuilt');

var sass = require("gulp-sass");

var browserSync = require('browser-sync');
var reload = browserSync.reload;


// 静态服务器 + 监听 scss/html 文件
gulp.task('music', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/sass/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', reload);
});

// scss编译后的css将注入到浏览器里实现更新
gulp.task('sass', function() {
    return gulp.src("app/sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(reload({stream: true}));
});

gulp.task('default', ['music']);

gulp.task('run',function(){
	childProcess.spawn(electron,['--debug=5858','.'],{stdio:'inherit'});
})