var gulp = require('gulp');
var coffee = require("gulp-coffee");

gulp.task('coffee', function() {
    gulp.src("*.coffee")
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest(''));
});
gulp.task('watch', function() {
    gulp.watch('*.coffee', function(event) {
        gulp.run('coffee');
    });
});
gulp.task('default', function () {
    gulp.run('coffee');
    gulp.run('watch');
});
