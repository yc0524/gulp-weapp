/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2022-01-10 10:41:49
 * @LastEditTime: 2022-01-12 10:47:29
 */
var request = require("request");
var qiniu = require("qiniu");

let amUpload = async function (localFile, key) {
  request(
    {
      url: "http://oms-token.aam.test/api/token/upload",
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: {
        key,
      },
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        let { data } = body;
        let { zone: zoneName, token: uploadToken } = data.token_info;
        var config = new qiniu.conf.Config();

        config.useCdnDomain = true;
        config.zone = qiniu.zone[`Zone_` + zoneName];

        var formUploader = new qiniu.form_up.FormUploader(config);
        var putExtra = new qiniu.form_up.PutExtra();

        formUploader.putFile(
          uploadToken,
          key,
          localFile,
          putExtra,
          function (respErr, respBody, respInfo) {
            if (respErr) {
              console.log("异常图片：" + key);
              throw respErr;
            }
            if (respInfo.statusCode === 200) {
              console.log("上传成功");
              console.log(respBody);
            } else {
              console.log(respInfo.statusCode);
              console.log(respBody);
            }
          }
        );
      }
    }
  );
};

module.exports = amUpload;
