var gulp = require('gulp');
var del = require('del');
var browserSync = require('browser-sync').create();

gulp.task('previewDist', function(){
	browserSync.init({
		notify: false,
		server: {
			baseDir: "docs"
		}
	});
});

gulp.task('deleteDistFolder', function(){
	return del('./docs');
});

gulp.task('copyGeneralFiles', ['deleteDistFolder'], function(){
	var pathsToCopy = [
		'./app/**/*',
	];
	return gulp.src(pathsToCopy)
		.pipe(gulp.dest('./docs'));
});

gulp.task('build', ['deleteDistFolder', 'copyGeneralFiles'], function(){
	gulp.start('previewDist');
});