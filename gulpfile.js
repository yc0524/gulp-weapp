/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2022-01-05 14:10:23
 * @LastEditTime: 2022-03-14 14:28:27
 */
const { src, dest, series, parallel, watch } = require("gulp");
let path = require("path");
let scss = require("gulp-dart-scss");
let rename = require("gulp-rename");
let aliases = require("gulp-wechat-weapp-src-alisa");
let eslint = require("gulp-eslint");
let imagemin = require("gulp-imagemin");
let clean = require("gulp-clean");
let minimist = require("minimist");
let preprocess = require("gulp-preprocess");
let projectSetting = require("./projectSetting");
let install = require("gulp-install");
let pngquant = require("imagemin-pngquant");
let uglify = require("gulp-uglify");
var gulpif = require("gulp-if");

let cache = require("gulp-cached");
var remember = require("gulp-remember");
let changed = require("gulp-changed");
let newer = require("gulp-newer");

const px2rpx = require("gulp-px2rpx");
var replace = require("gulp-replace");

var amUpload = require("./bin/uploadqiniu");
var glob = require("glob");

const mpNpm = require("gulp-mp-npm");
var rev = require("gulp-rev");
var revCollector = require("gulp-rev-collector");

let filePath = {
  scssPath: ["src/**/*.scss", "src/**/*.wxss"],
  copy: [
    "src/**/*.wxml",
    "src/**/*.json",
    "*.json",
    "!package-lock.json",
    "!package.json",
  ],
  jsPath: ["src/**/*.js"],
  images: ["src/**/*.{png,jpg,jpeg,gif}"],
  imagesPublic: ["src/public/**/*.{png,jpg,jpeg,gif}"],
};

const aliasConfig = {
  "@components": path.resolve(__dirname, "./", "src/components"),
  "@pages": path.resolve(__dirname, "./", "src/pages"),
  "@utils": path.resolve(__dirname, "./", "src/utils"),
  "@styles": path.resolve(__dirname, "./", "src/styles"),
  "@api": path.resolve(__dirname, "./", "src/api"),
  "@store": path.resolve(__dirname, "./", "src/store"),
  "@mixin": path.resolve(__dirname, "./", "src/mixin"),
  "@npmpackage": path.resolve(__dirname, "./", "src/npmpackage"),
  "@store": path.resolve(__dirname, "./", "src/store"),
  "@plugins": path.resolve(__dirname, "./", "src/plugins"),
  "mobx-miniprogram-bindings": path.resolve(
    __dirname,
    "./",
    "src/plugins/mobx-miniprogram-bindings/index.js"
  ),
  "mobx-miniprogram": path.resolve(
    __dirname,
    "./",
    "src/plugins/mobx-miniprogram/index.js"
  ),
  "miniprogram-recycle-view": path.resolve(
    __dirname,
    "./",
    "src/plugins/miniprogram-recycle-view/index.js"
  ),
};

const knownOptions = {
  string: "env",
  default: {
    env: process.env.NODE_ENV || "production",
  },
};

var options = minimist(process.argv.slice(2), knownOptions);

console.log("options", options);

var curenV = options.apimode;

var ENV_INFO = projectSetting[curenV];

var options = {
  dev: {
    output: "dist2",
  },
  prev: {
    output: "dist",
  },
  prod: {
    output: "dist",
  },
};

let outputPath = options[curenV].output;

// ??????scss??????
function compileScss() {
  return src(filePath.scssPath)
    .pipe(cache("compileScss"))
    .pipe(aliases(aliasConfig))
    .pipe(scss())
    .on("error", function (err) {
      console.log(err.toString());
    })
    .pipe(
      px2rpx({
        screenWidth: 750, // ???????????????, ??????750
        wxappScreenWidth: 750, // ?????????????????????, ??????750
        remPrecision: 6, // ????????????, ??????6
      })
    )
    .pipe(replace(/\/\*\s*<--\s*(\S+\s?\S+)\s*-->\s*\*\//g, "$1"))
    .pipe(
      rename({
        extname: ".wxss",
      })
    )
    .pipe(dest(outputPath));
}

exports.compileScss = compileScss;

// ??????wxs,wxml,json??????????????????
function copy() {
  return src(filePath.copy)
    .pipe(cache("copy"))
    .pipe(aliases(aliasConfig))
    .pipe(remember("copy"))
    .pipe(dest(outputPath));
}

exports.copy = copy;

// js
function js() {
  return src(filePath.jsPath)
    .pipe(cache("js"))
    .pipe(aliases(aliasConfig))
    .pipe(
      preprocess({
        context: {
          ...options,
          ...ENV_INFO,
          NODE_ENV: curenV,
        },
      })
    )
    .pipe(remember("js"))
    .pipe(dest(outputPath));
}

exports.js = js;

// ????????????
function images() {
  return src(filePath.images)
    .pipe(
      imagemin({
        optimizationLevel: 3, //?????????Number  ?????????3  ???????????????0-7??????????????????
        progressive: true, //?????????Boolean ?????????false ????????????jpg??????
        interlaced: true, //?????????Boolean ?????????false ????????????gif????????????
        use: [pngquant()], //??????pngquant????????????png?????????imagemin??????
      })
    )
    .pipe(rev())
    .pipe(dest("image-dist/version"))
    .pipe(rev.manifest()) // ??????????????????
    .pipe(dest("image-dist"))
    .on("finish", function () {
      glob("image-dist/version/assets/**/*.*", function (err, files) {
        files.forEach(function (file) {
          let localFile = path.join(__dirname, file);
          let spaceName = "miniapp";
          let localFilePath = file.replace(
            "image-dist/version/assets/images/",
            ""
          );
          let key = `${spaceName}/${localFilePath}`;
          amUpload(localFile, key);
        });
      });
    });
}

exports.images = images;

// ??????????????????
function imagesPublic() {
  return src(filePath.imagesPublic)
    .pipe(
      imagemin({
        optimizationLevel: 5, //?????????Number  ?????????3  ???????????????0-7??????????????????
        progressive: true, //?????????Boolean ?????????false ????????????jpg??????
        interlaced: true, //?????????Boolean ?????????false ????????????gif????????????
        use: [pngquant()], //??????pngquant????????????png?????????imagemin??????
      })
    )
    .pipe(dest(outputPath + "/public"));
}

exports.imagesPublic = imagesPublic;

// ??????dist??????
function cleanfile() {
  return src(
    [`!${outputPath}/miniprogram_npm`, `!${outputPath}/node_modules`],
    {
      read: false,
      allowEmpty: true,
    }
  ).pipe(
    clean({
      allowEmpty: true,
    })
  );
}

exports.cleanfile = cleanfile;

// ??????dist??????
function cleanfileAll() {
  return src([outputPath + "/*"], {
    read: false,
    allowEmpty: true,
  }).pipe(clean());
}

exports.cleanfileAll = cleanfileAll;

function cleanNpmLockFile() {
  return src(
    [`${outputPath}/package-lock.json`, `${outputPath}/package.json`],
    {
      read: false,
      allowEmpty: true,
    }
  );
}

function installPackage() {
  return src([outputPath + "src/*"])
    .pipe(dest(outputPath))
    .pipe(
      install({
        production: true,
      })
    );
}

exports.installPackage = installPackage;

// ???????????????
function rev2() {
  return src([
    "image-dist/rev-manifest.json",
    outputPath + "/**/*.{wxml,js,wxss}",
  ])
    .pipe(
      revCollector({
        replacedReved: true,
        dirReplacements: {
          "/": function (manifest_value, a, b, c) {
            let cdnHost = "wt-media-test.singworld.cn";
            if (manifest_value.includes("assets/images/")) {
              let path = manifest_value.replace("assets/images/", "");
              return `https://${cdnHost}/miniapp/` + path;
            } else {
              let path = manifest_value.replace(/\-[a-z0-9]+\./, ".");
              return "/" + path;
            }
          },
        },
      })
    )
    .pipe(dest(outputPath));
}

exports.rev2 = rev2;

function watchTask(cb) {
  watch(filePath.scssPath, series(compileScss, rev2));
  watch(filePath.jsPath, series(js, rev2));
  watch(filePath.copy, series(copy, rev2));
  watch(filePath.images, images);
  watch(filePath.imagesPublic, imagesPublic);
  cb();
}

exports.buildTask = series(
  cleanfileAll,
  parallel(images, imagesPublic),
  copy,
  parallel(compileScss, js),
  rev2,
  cleanNpmLockFile
);

exports.dev = series(
  cleanfileAll,
  parallel(images, imagesPublic),
  copy,
  parallel(compileScss, js),
  rev2,
  cleanNpmLockFile,
  watchTask
);
