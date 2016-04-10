//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'); //本地安装gulp所用到的地方

var less = require('gulp-less'),            // less
    minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'),        // js压缩
    concat = require('gulp-concat'),        // 合并文件
    rename = require('gulp-rename'),        // 重命名
    order = require("gulp-order"),
    clean = require('gulp-clean');          //清空文件夹
// 
var webserver = require('gulp-connect');

var config = {
	nodeModulesDir: './node_modules',
    bootstrapDir: './node_modules/bootstrap',
    jqueryDir: './node_modules/jquery',
    assetsDir: './resource/assets',
    publicDir: './public',
    htmlDir: './resource/view'
};

gulp.task('webserver', function() {
  webserver.server({
    root: './',
    livereload: true,
    port: 8000
  });
});

gulp.task('html', function () {
  gulp.src(config.htmlDir + '/*.html')
    .pipe(webserver.reload());
});

gulp.task('build-website', function() {
	gulp.src(config.htmlDir + '/*.html')
    	.pipe(gulp.dest('./'));
});

// less 解析
gulp.task('build-less', function () {
    gulp.src(config.assetsDir + '/less/*.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest(config.assetsDir + '/css')); //将会在assets/css下生成index.css
});

// 合并、压缩、重命名css
gulp.task('stylesheets', function() {
    // 注意这里通过数组的方式写入两个地址,仔细看第一个地址是css目录下的全部css文件,第二个地址是css目录下的areaMap.css文件,但是它前面加了!,这个和.gitignore的写法类似,就是排除掉这个文件.
	gulp.src(config.assetsDir +'/css/*.css')
		.pipe(concat('all.css'))
		.pipe(gulp.dest(config.publicDir + '/css'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest(config.publicDir + '/css'));
});

// 合并，压缩js文件
gulp.task('javascripts' , function() {
	gulp.src(config.assetsDir + '/js/*.js')
		.pipe(order([
			'jquery.min.js',
			// 'underscore-min.js',
			'move-top.js',
			'easing.js'
		]))
		.pipe(concat('all.js'))
		.pipe(gulp.dest(config.publicDir + '/js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest(config.publicDir + '/js'));
});

// 清理
gulp.task("clean", function (done) {
    //return cache.clearAll(done);
    return gulp.src([
    	config.publicDir,
    	'./index.html',
    	'./gallery.html',
    	'./about.html',
    	'./pages.html',
    	'./contact.html',
    	'./single.html',
    	'./blog.html',
    	// '!' + config.publicDir + '/images',
    	// '!' + config.publicDir + '/fonts',
    ], {
        read: false
    })
    .pipe(clean({force: true}));

});

// 输出bootstrap 
gulp.task('build-bootstrap', function() {
	gulp.src(config.bootstrapDir + '/dist/css/bootstrap.min.css')
		.pipe(gulp.dest(config.assetsDir + '/css'));
	gulp.src(config.bootstrapDir + '/dist/fonts/*')
		.pipe(gulp.dest(config.assetsDir + '/fonts'));
	gulp.src(config.bootstrapDir + '/dist/js/bootstrap.min.js')
		.pipe(gulp.dest(config.assetsDir + '/js'));
});

gulp.task('build-js', function() {
	gulp.src(config.nodeModulesDir + '/jquery/dist/jquery.min.js')
		.pipe(gulp.dest(config.assetsDir + '/js'));
	gulp.src(config.nodeModulesDir + '/underscore/underscore-min.js')
		.pipe(gulp.dest(config.assetsDir + '/js'));
});

gulp.task('build-image', function() {
	gulp.src(config.assetsDir + '/images/*')
		.pipe(gulp.dest(config.publicDir + '/images'));
});

// 定义develop任务在日常开发中使用
gulp.task('develop',function(){
	gulp.run('build-less', 'build-js', 'build-bootstrap', 'stylesheets', 'javascripts', 'build-image', 'build-website');
	gulp.watch(config.assetsDir + '/less/*.less', ['build-less']);
	gulp.watch(config.assetsDir + '/css/*.css', ['stylesheets']);
	gulp.watch(config.assetsDir + '/js/*.js', ['javascripts']);
	gulp.watch(config.htmlDir + '/*.html', ['html']);
});

gulp.task('prod',function(){
	gulp.run('build-less', 'build-js', 'build-bootstrap', 'stylesheets', 'javascripts', 'build-image', 'build-website');
  // gulp.watch(config.assetsDir + '/less/*.less', ['build-less']);
  // gulp.watch(config.assetsDir + '/js/*.js', ['build-js']);
});

// 定义默认任务
gulp.task('default', ['clean'], function() {
	gulp.run('develop');
}); 