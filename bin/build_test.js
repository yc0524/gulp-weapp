/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2022-01-07 17:27:10
 * @LastEditTime: 2022-01-10 16:50:30
 */
const ci = require("miniprogram-ci");
const path = require("path");
let { wxVersion: version, wxDesc: desc } = require("../package.json").wx;

let projectPath = path.join(__dirname, "../dist2");
let keyPath = path.join(__dirname, "../keys/private.wx689a4b8fe3fccc63.key");

const project = new ci.Project({
  appid: "wx689a4b8fe3fccc63",
  type: "miniProgram",
  projectPath: projectPath,
  privateKeyPath: keyPath,
  ignores: ["node_modules/**/*"],
});

let upload = function () {
  ci.upload({
    project,
    version,
    desc: `${desc}_prod`,
    setting: {
      minify: true,
      es7: true,
      es6: true,
      autoPrefixWXSS: true,
    },
  })
    .then((res) => {
      console.log(res);
      console.log("上传成功");
    })
    .catch((err) => {
      if (err.errCode == -1) {
        console.log("上传成功");
      }
      console.log(err);
      console.log("上传失败");
      process.exitCode(-1);
    });
};

let task = async () => {
  upload();
};

task();
