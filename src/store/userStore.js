/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2022-01-12 14:34:56
 * @LastEditTime: 2022-01-18 16:04:25
 */
import { observable, computed, flow, reaction, toJS } from "mobx-miniprogram";

import { getToken, getProfile, bindPhone, refreshToken } from "@api/login";

class UserStore {
  @observable token = "";
  @observable refresh_token = "";
  @observable token_type = "";
  @observable expires_in = "";

  @observable userSettingInfo = {
    uid: 0,
    avatar_uri: "",
    phone: "",
    nick_name: "",
    birthday: "",
    sex: "",
    customer_contact: "",
  };

  @observable isGetUserInfoFromRequest = false;

  @computed
  get uid() {
    return this.userSettingInfo.uid;
  }

  @computed
  get avatar_uri() {
    return this.userSettingInfo.avatar_uri;
  }

  @computed
  get phone() {
    // 脱敏处理
    let str = this.userSettingInfo.phone + "";
    const str1 = str.replace(/(\d{3})\d*(\d{4})/, "$1****$2");
    return str1;
  }

  @computed
  get nick_name() {
    return this.userSettingInfo.nick_name;
  }

  @computed
  get birthday() {
    return this.userSettingInfo.birthday;
  }

  @computed
  get sex() {
    return this.userSettingInfo.sex;
  }

  @computed
  get customer_contact() {
    return this.userSettingInfo.customer_contact;
  }

  @observable state = "pending";

  @observable isLogined() {
    return !!this.token;
  }

  @computed
  get isBindUserInfo() {
    return !!this.userSettingInfo.nick_name;
  }

  @computed
  get isBindUserPhone() {
    return !!this.userSettingInfo.phone;
  }

  @computed
  get isUserRegisterFinished() {
    let result =
      !!this.userSettingInfo.phone &&
      !!this.userSettingInfo.nick_name &&
      this.token;
    return result;
  }

  // 区分用户注册3种情况
  // step1  既没有绑定用户信息 又没有绑定手机，相当于新用户
  // step2  只绑定了用户信息，没有绑定手机，  需要用户继续完成注册流程
  // step3  既绑定了用户信息，又绑定了手机，用户已完成注册流程
  @computed
  get registerUserStep() {
    if (!this.isBindUserInfo && !this.isBindUserPhone) {
      return "step1";
    }
    if (this.isBindUserInfo && !this.isBindUserPhone) {
      return "step2";
    }
    return "step3";
  }

  // 微信登录promise 封装
  WxLogin() {
    return new Promise((resolve, reject) => {
      wx.login({
        timeout: 5000,
        success(res) {
          resolve(res);
        },
        fail(res) {
          reject(res);
        },
      });
    });
  }

  // 登录操作
  login = flow(function* () {
    // 判断是否使用缓存token
    let userTokenFromStorageStr;
    try {
      let storageResult = yield wx.getStorage({
        key: "userToken",
      });
      userTokenFromStorageStr = storageResult.errMsg.includes("getStorage:ok")
        ? storageResult.data
        : "";
    } catch (error) {
      userTokenFromStorageStr = "";
    }

    if (userTokenFromStorageStr) {
      let userTokenFromStorageJSON = JSON.parse(userTokenFromStorageStr);
      let now = parseInt(Date.now() / 1000);
      let tokenEfficientFromStorage =
        userTokenFromStorageJSON.expires_in +
        userTokenFromStorageJSON.timestamp;

      // 对比缓存时间戳，距离token失效前2小时，不采用缓存token，并销毁缓存
      if (tokenEfficientFromStorage - now > 7200) {
        // 使用缓存
        this.token = userTokenFromStorageJSON.token;
        this.refresh_token = userTokenFromStorageJSON.refresh_token;
      } else {
        // 不使用缓存，并同步销毁
        yield wx.removeStorage({
          key: "userToken",
        });
      }
    }

    const { code } = yield this.WxLogin();
    try {
      let result = yield getToken(code);
      if (result.access_token) {
        this.token = result.access_token;
        this.refresh_token = result.refresh_token;
        this.expires_in = result.expires_in;
        this.token_type = result.token_type;
      }
    } catch (err) {
      return false;
    }
  });

  // 将token缓存到storage
  setUserTokenInStorage({ token, refresh_token, expires_in, token_type }) {
    let userTokenStorage = {
      token,
      refresh_token,
      expires_in,
      token_type,
      timestamp: parseInt(Date.now() / 1000),
    };
    wx.setStorage({
      key: "userToken",
      data: JSON.stringify(userTokenStorage),
    });
  }

  // 刷新token
  refreshToken = flow(function* (cb) {
    try {
      let result = yield refreshToken({
        refresh_token: this.refresh_token,
      });
      if (result.access_token) {
        this.token = result.access_token;
        this.refresh_token = result.refresh_token;
        this.expires_in = result.expires_in;
        this.token_type = result.token_type;

        this.setUserTokenInStorage({
          token: result.access_token,
          refresh_token: result.refresh_token,
          expires_in: result.expires_in,
          token_type: result.token_type,
        });

        cb && cb(result.access_token);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  });

  // 获取用户基础信息

  // 向服务端设置用户信息，首次用户访问使用
  miniprogramProfile = flow(function* (
    { encryptedData, iv },
    { successCallback, failCallback }
  ) {
    try {
      let { status, msg } = yield getProfile({
        encryptedData,
        iv,
      });
      if (status === 0 && msg == "ok") {
        // this.getUserInfo()
        successCallback && successCallback();
      } else {
        failCallback && failCallback("用户信息绑定失败");
      }
    } catch (error) {
      failCallback && failCallback("用户信息绑定失败");
    }
  });

  // 在服务端绑定手机
  setUserPhone = flow(function* ({ data, successCallback, failCallback }) {
    let { data: value } = yield bindPhone({
      data,
    });
    let result = value;
    let { accessToken, refreshToken, expiresIn, tokenType } = result;

    if (accessToken) {
      this.token = accessToken;
      this.refresh_token = refreshToken;
      this.expires_in = expiresIn || this.expireIn;
      this.token_type = tokenType || this.tokenType;

      this.setUserInfoInStorage({
        token: accessToken,
        refresh_token: refreshToken,
        expires_in: this.expires_in,
        token_type: this.token_type,
      });

      // 重置用户信息
      // yield this.getUserInfo()
      successCallback && successCallback();
    } else {
      failCallback && failCallback();
    }
  });

  // 获取用户基础信息
  getUserInfo = flow(function* (canUseCache = true) {

    // 判断是否使用缓存token
    // let userInfoFromStoageStr
    // if (canUseCache) {
    //   try {
    //     let storageResult = yield wx.getStorage({
    //       key: "userInfo"
    //     })
    //     userInfoFromStoageStr = storageResult.errMsg.includes("getStorage:ok") ? storageResult.data : ''
    //   } catch (e) {
    //     userInfoFromStoageStr = ""
    //   }

    //   if (userInfoFromStoageStr) {
    //     console.log("使用userInfo缓存")
    //     let userInfoFromStoageJSON = JSON.parse(userInfoFromStoageStr)
    //     this.userSettingInfo = {
    //       ...userInfoFromStoageJSON
    //     }
    //     if (userInfoFromStoageJSON.uid) {
    //       this.isGetUserInfoFromRequest = true
    //     }
    //   }
    // }


    // const {
    //   data,
    //   status,
    //   msg
    // } = yield getUserInfo();
    // if (status === 0) {


    //   if (data.uid != this.userSettingInfo.uid && this.userSettingInfo.uid) {
    //     wx.nextTick(() => {
    //       eventBus.emit('uidChange')
    //     })
    //   }

    //   this.userSettingInfo = {
    //     uid: data.uid,
    //     avatar_uri: data.avatar_uri,
    //     phone: data.phone,
    //     nick_name: data.nick_name,
    //     birthday: data.birthday,
    //     sex: data.sex,
    //     customer_contact: data.customer_contact,
    //   }

    //   this.isGetUserInfoFromRequest = true
    //   // 将用户信息保存到缓存
    //   this.setUserInfoInStorage(this.userSettingInfo)
    // }
  })
  // 缓存用户基础数据
  setUserInfoInStorage({
    uid,
    avatar_uri,
    phone,
    nick_name,
    birthday,
    sex,
    customer_contact,
  }) {
    let userInfoStorage = {
      uid,
      avatar_uri,
      phone,
      nick_name,
      birthday,
      sex,
      customer_contact,
    };
    wx.setStorage({
      key: "userInfo",
      data: JSON.stringify(userInfoStorage),
    });
  }

  WxUploadFile(params) {
    return new Promise((resolve) => {
      wx.uploadFile({
        ...params,
        success: function (res) {
          resolve(res);
        },
        fail: function (res) {
          resolve(res);
        },
      });
    });
  }

  // 上传七牛图片，返回url
  uploadPicToQiuniu = flow(function* (file) {
    const fileName = file.match(/[A-Za-z0-9]+\.(png|jpg|jpeg|gif)/)[0];

    const { data: tokenResult } = yield GetUploadToken({
      filename: fileName,
    });

    const formData = {
      token: tokenResult.token_info.token,
      key: tokenResult.key,
    };
    //   上传到七牛云
    const uploadResult = yield this.WxUploadFile({
      url: `https://up-${tokenResult.token_info.zone}.qbox.me`,
      filePath: file,
      name: "file",
      formData,
    });
    const dataString = uploadResult.data;
    const dataObject = JSON.parse(dataString);
    if (dataObject.key) {
      // 获取图片url
      const res = yield PostUploadResult({
        key: dataObject.key,
        status: 1,
      });
      return res.data.url;
    }
    return "";
  });
}

const userStore = new UserStore();



// 监听用户信息是否发生变化 当发生修改的话 保存到缓存
reaction(
  () => toJS(userStore.userSettingInfo),
  (data) => {
    console.log("发生修改");
    userStore.setUserInfoInStorage(data);
  },
  {
    delay: 0,
  }
);

export default userStore;
