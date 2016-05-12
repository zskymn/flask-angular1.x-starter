var gulp = require('gulp'),
  gulpif = require('gulp-if'),
  argv = require('yargs').argv,
  sourcemaps = require('gulp-sourcemaps'),
  del = require('del'),
  runSequence = require('run-sequence'),
  concat = require('gulp-concat'),
  include = require('gulp-include'),
  ngTpl = require('gulp-angular-templatecache'),
  ngAnnotate = require('gulp-ng-annotate'),
  postcss = require('gulp-postcss'),
  atImport = require('postcss-import'),
  cssnext = require('postcss-cssnext'),
  precss = require('precss'),
  assets = require('postcss-assets'),
  cssShort = require('postcss-short'),
  cssnano = require('cssnano'),
  functions = require('postcss-functions'),
  htmlInclude = require('gulp-file-include'),
  usemin = require('gulp-usemin'),
  rev = require('gulp-rev'),
  uglify = require('gulp-uglify'),
  size = require('gulp-size');

var modules = ['vendor', 'base', 'home', 'login'],
  jsTasks = [],
  cssTasks = [],
  tplTasks = [],
  pageTasks = [],
  srcDir = 'src',
  tmpDir = 'tmp',
  destDir = 'dist';

function useminProcessors() {
  if (argv.production) {
    return [
      rev(),
      size({
        gzip: true,
        showFiles: true
      })
    ];
  } else {
    return [
      rev()
    ];
  }
}

// 重写gulp.src
(function () {
  if (argv.production) {
    return;
  }

  var plumber = require('gulp-plumber'),
    notify = require('gulp-notify');

  var _gulpsrc = gulp.src;
  gulp.src = function () {
    return _gulpsrc.apply(gulp, arguments)
      .pipe(plumber({
        errorHandler: function (error) {
          console.log(error);
          notify.onError({
            title: 'Gulp Error',
            message: "Error: <%= error.message %>",
            sound: "Bottle"
          })(error);
        }
      }));
  };
})();

gulp.task('clean-dist', function () {
  return del([destDir, tmpDir], {
    force: true
  });
});

modules.forEach(function (name) {
  var taskName = 'clean-asset-' + name;
  gulp.task(taskName, function () {
    return del(destDir + '/static/' + name + '/*.@(js|css)', {
      force: true
    });
  });

});

gulp.task('img', function () {
  return gulp
    .src(srcDir + '/img/**/*')
    .pipe(gulp.dest(destDir + '/static/img'));
});

modules.forEach(function (name) {
  var taskName = 'js-' + name;
  jsTasks.push(taskName);
  gulp.task(taskName, function () {
    return gulp
      .src(srcDir + '/' + name + '/js/module.js')
      .pipe(gulpif(!argv.production, sourcemaps.init()))
      .pipe(include())
      .pipe(concat(name + '.js'))
      .pipe(gulpif(argv.production, ngAnnotate()))
      .pipe(gulpif(argv.production, uglify()))
      .pipe(gulpif(!argv.production, sourcemaps.write()))
      .pipe(gulp.dest(tmpDir + '/' + name));
  });
});

modules.forEach(function (name) {
  if (name === 'vendor') {
    return;
  }

  var taskName = 'tpl-' + name;
  tplTasks.push(taskName);

  gulp.task(taskName, function () {
    return gulp
      .src(srcDir + '/' + name + '/js/**/*.html')
      .pipe(ngTpl('tpls.js', {
        root: name,
        templateHeader: 'function($templateCache){\n',
        templateFooter: '\n}'
      }))
      .pipe(gulp.dest(srcDir + '/' + name + '/js'));
  });

});

modules.forEach(function (name) {
  var taskName = 'css-' + name;
  cssTasks.push(taskName);
  gulp.task(taskName, function () {
    var postcssPlugins = [];
    if (name === 'vendor') {
      postcssPlugins = [
        atImport(),
        cssnext()
      ];
    } else {
      postcssPlugins = [
        precss(),
        cssnext(),
        cssShort(),
        assets(),
        functions({
          functions: {
            getMediaWidthBySpaceWidth: function (spaceWidth) {
              return (parseInt(spaceWidth, 10) + 760) + 'px';
            },
            getPixelSize: function (size, offset) {
              return (parseInt(size, 10) + parseInt(offset, 10)) + 'px';
            }
          }
        })
      ];
    }

    if (argv.production) {
      postcssPlugins.push(cssnano({
        autoprefixer: false,
        safe: true
      }));
    }
    return gulp
      .src(srcDir + '/' + name + '/css/all.css')
      .pipe(postcss(postcssPlugins, {
        map: !argv.production
      }))
      .pipe(concat(name + '.css'))
      .pipe(gulp.dest(tmpDir + '/' + name));
  });
});

gulp.task('copy-page-html', function () {
  return gulp
    .src(srcDir + '/base/page.html')
    .pipe(gulp.dest(tmpDir + '/base'));
});

gulp.task('asset', ['copy-page-html', 'clean-asset-base', 'clean-asset-vendor'], function () {
  return gulp
    .src(srcDir + '/base/asset.html')
    .pipe(usemin({
      path: tmpDir,
      outputRelativePath: '../../' + destDir + '/',
      jsVendor: useminProcessors(),
      jsBase: useminProcessors(),
      cssVendor: useminProcessors(),
      cssBase: useminProcessors()
    }))
    .pipe(gulp.dest(tmpDir + '/base'));
});

modules.forEach(function (name) {
  if (['vendor', 'base'].indexOf(name) !== -1) {
    return;
  }
  var taskName = 'page-' + name;
  pageTasks.push(taskName);
  gulp.task(taskName, ['clean-asset-' + name], function () {
    return gulp
      .src(srcDir + '/' + name + '/index.html')
      .pipe(concat(name + '.html'))
      .pipe(htmlInclude({
        basepath: tmpDir
      }))
      .pipe(usemin({
        path: tmpDir,
        outputRelativePath: '../',
        jsPage: useminProcessors(),
        cssPage: useminProcessors()
      }))
      .pipe(gulp.dest(destDir + '/pages'));
  });
});

gulp.task('watch', function () {
  if (argv.production) {
    return;
  }
  var watch = require('gulp-watch');
  jsTasks.forEach(function (taskName) {
    var name = taskName.replace('js-', '');
    watch(srcDir + '/' + name + '/js/**/!(*.spec).js', function () {
      runSequence(taskName);
    });
  });

  cssTasks.forEach(function (taskName) {
    var name = taskName.replace('css-', '');
    watch(srcDir + '/' + name + '/css/**/*.css', function () {
      runSequence(taskName);
    });
  });

  pageTasks.forEach(function (taskName) {
    var name = taskName.replace('page-', '');
    watch([
      tmpDir + '/' + name + '/*.@(js|css)',
      srcDir + '/' + name + '/index.html'
    ], function () {
      runSequence(taskName);
    });
  });

  tplTasks.forEach(function (taskName) {
    var name = taskName.replace('tpl-', '');
    watch(srcDir + '/' + name + '/js/**/*.html', function () {
      runSequence(taskName);
    });
  });

  watch(tmpDir + '/@(base|vendor)/*.@(js|css)', function () {
    runSequence('asset');
  });

  watch(tmpDir + '/base/*.html', function () {
    runSequence(pageTasks);
  });
});

gulp.task('test', function (done) {
  if (argv.production) {
    return done();
  }
  var KarmaServer = require('karma').Server;

  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, function () {
    done();
  }).start();
});

gulp.task('default', function (cb) {
  runSequence('clean-dist', 'img', tplTasks, jsTasks, cssTasks, 'asset', pageTasks, 'watch', cb);
});
