// Definitions
var fileVersion = "";
// Definitions
var gulp = require("gulp"),
  sourcemaps = require("gulp-sourcemaps"),
  plumber = require("gulp-plumber"),
  livereload = require("gulp-livereload"),
  surge = require("gulp-surge"),
  rename = require("gulp-rename"),
  path = require("path"),
  babel = require("gulp-babel"),
  babelify = require("babelify"),
  browserify = require("browserify"),
  uglify = require("gulp-uglify"),
  source = require("vinyl-source-stream"),
  buffer = require("vinyl-buffer"),
  sass = require("gulp-ruby-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  purify = require("gulp-purifycss"),
  minifycss = require("gulp-minify-css");
imagemin = require("gulp-imagemin");
(pug = require("gulp-pug")), (data = require("gulp-data"));

// JS
gulp.task("es6", () => {
  browserify("src/js/app.js")
    .transform("babelify", {
      presets: ["es2015"],
      sourceMapsAbsolute: true
    })
    .bundle()
    .pipe(source("app.js"))
    .pipe(plumber())
    .pipe(buffer())
    .pipe(rename("bundle.js"))
    .pipe(plumber())
    .pipe(gulp.dest("js/"))
    .pipe(
      rename({
        suffix: fileVersion
      })
    )

    .pipe(plumber());
});

gulp.task("compress", function() {
  gulp
    .src("./js/bundle.js")
    .pipe(rename("bundle.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("./js"))
    .pipe(rename("bundle" + fileVersion + ".min.js"))
    .pipe(plumber())
    .pipe(uglify())

    .pipe(livereload());
});

//Style
gulp.task("style", function() {
  sass("src/scss/*.scss", {
    sourcemap: true,
    style: "compressed"
  })
    .pipe(plumber())
    .on("error", sass.logError)
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    // .pipe(csscss())
    .pipe(
      sourcemaps.write("maps", {
        includeContent: false,
        sourceRoot: "source"
      })
    )
    .pipe(gulp.dest("css"))
    .pipe(
      rename({
        suffix: fileVersion
      })
    )

    .pipe(livereload());
});

gulp.task("purecss", function() {
  return gulp
    .src(["./css/ltr-style.css", "./css/rtl-style.css"])
    .pipe(
      purify([
        // './index-en.html',
        // './index-ar.html',
      ])
    )
    .pipe(minifycss())
    .pipe(
      rename({
        suffix: ".pure"
      })
    )
    .pipe(gulp.dest("./css/"));
});

//PUG
gulp.task("pug", function() {
  gulp
    .src([
      // "src/pug/index-en.pug",
      "src/pug/index-ar.pug",
      // "src/pug/section-en.pug",
      "src/pug/section-ar.pug",
      // "src/pug/favourites-ar.pug",
      // "src/pug/favourites-en.pug",
      // "src/pug/browse-jobs-ar.pug",
      // "src/pug/browse-jobs-en.pug",
      // "src/pug/advanced-search-ar.pug",
      // "src/pug/advanced-search-en.pug",
      // "src/pug/registration-ar.pug",
      // "src/pug/registration-en.pug",
      // "src/pug/single-job-ar.pug",
      // "src/pug/single-job-en.pug"

    ])
    .pipe(plumber())
    .pipe(
      pug({
        pretty: true,
        data: {
          dataAr: require("./src/data/data-ar.json"),
          dataEn: require("./src/data/data-en.json")
        }
      })
    )
    .pipe(gulp.dest("./"))
    .pipe(livereload());
});
//Img Min
gulp.task("compressimages", function() {
  gulp
    .src("img/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 15 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(gulp.dest("img/"));
});

//Watch
var start = false;
var watchFiles = {
  js: ["src/js/*.js", "src/js/**/*.js", "src/js/**/**/*.js"],
  scss: ["src/scss/*.scss", "src/scss/**/*.scss"],
  css: ["./css/rtl-style.css"],
  pug: ["src/pug/*.pug", "src/pug/**/*.pug"],
  compress: ["js/bundle.js"]
};

gulp.task("watch", function() {
  livereload.listen();
  gulp.watch(
    watchFiles.js,
    {
      debounceDelay: 500,
      awaitWriteFinish: true
    },
    ["es6"]
  );
  gulp.watch(
    watchFiles.scss,
    {
      debounceDelay: 500,
      awaitWriteFinish: true
    },
    ["style"]
  );
  // gulp.watch(watchFiles.css, ['purecss']);
  gulp.watch(
    watchFiles.pug,
    {
      debounceDelay: 500,
      awaitWriteFinish: true
    },
    ["pug"]
  );
  gulp.watch(
    watchFiles.compress,
    {
      debounceDelay: 500,
      awaitWriteFinish: true
    },
    ["compress"]
  );
  if (!start) {
    start = true;
    gulp.watch("gulpfile.js", ["default"]);
  }
});

//surge
gulp.task("deploy", [], function() {
  return surge({
    project: "./",
    domain: "shoghlanty.surge.sh"
  });
});

//  gulp.task('default',['es6','compress','style','pug','watch'])
//  gulp.task('default',['style','pug','watch'])
gulp.task("default", ["es6", "compress", "watch"]);
