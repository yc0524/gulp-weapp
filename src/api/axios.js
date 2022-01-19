/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2022-01-12 14:26:19
 * @LastEditTime: 2022-01-12 17:42:23
 */
import userStore from "@store/userStore";
import { getCurPageRoute, sleep } from "@utils/util";
import { request } from "miniprogram-ci/dist/@types/utils/request";

const API_URL = "/* @echo API_URL */";

let timerMap = new Map();
let requestId = 0;
let isShowLoading = false;

// 并发请求，出现token失效的时候
let refreshTokenLock = false;

// 微信request封装
let wxRequestPromise = function (params, requestId) {
  return new Promise((resolve, reject) => {
    let header = {};
    const token = userStore.token;

    token && (header["Authorization"] = `Bearer ${token}`);

    params.header = {
      ...params.header,
      ...header,
    };

    if (!/^http|https/.test(params.url)) {
      params.url = API_URL + params.url;
    }

    let requestTask = wx.request({
      ...params,
      timeout: 10000,
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

const requestFunc = function ({ url, method, data = {}, header = {} }) {
  return new Promise(async (resolve, reject) => {
    // 创建请求id
    let requestFlg = requestId++;
    // 请求接口超过500ms 显示loading
    let timer = setTimeout(() => {
      isShowLoading = true;
      wx.showLoading({
        title: "努力加载中",
      });
    }, 2000);

    timerMap.set(requestFlg, timer);

    let resultParams = {
      url,
      method,
      data,
      header,
    };

    let requestResult;
    try {
      requestResult = await wxRequestPromise(resultParams);
      // 当业务接口出现异常
      if (
        requestResult.statusCode >= 500 ||
        requestResult.data.status >= 500 ||
        [400, 403].includes(requestResult.statusCode)
      ) {
        throw new Error(
          `${requestResult.msg},url:${url},code:${requestResult.status}`
        );
      }

      // 当出现401，未授权的情况下，先刷新token，然后重发请求
      if (
        requestResult.statusCode === 401 ||
        requestResult.data.status === 401
      ) {
        if (refreshTokenLock) {
          // 如果正在刷新token的过程中 先延迟1s
          await sleep(1000);
        } else {
          refreshTokenLock = true;
          let refreshTokenResult = await userStore.refreshToken();
          if (!refreshTokenResult) {
            wx.showToast({
              icon: "none",
              title: "请登录",
            });
            // wx.navigateTo({
            //   url: "/subPage/userLogin/login/login",
            // });
            throw new Error(`刷新token失败，请检查获取token接口`);
          }
        }
        refreshTokenLock = false;
        // 当刷新token成功后 重新发送业务请求
        requestResult = wxRequestPromise(resultParams);
      }

      resolve(requestResult.data);
    } catch (error) {
      if (timerMap.has(requestFlg)) {
        let timer2 = timerMap.get(requestFlg);
        clearTimeout(timer2);
        timerMap.delete(requestFlg);

        if (timerMap.size == 0) {
          if (isShowLoading) {
            isShowLoading = false;
            wx.hideLoading();
          }
        }
      }

      // 判断是否超时
      if (error.errMsg) {
        wx.getNetworkType({
          success(res) {
            if (res.networkType == "none") {
              // 无网络
              let curUrl = "/" + getCurPageRoute();
              let decodeCurUrl = encodeURIComponent(curUrl);

              if (!curUrl.includes("pages/error/error")) {
                wx.redirectTo({
                  url: `/pages/error/error?url=${decodeCurUrl}`,
                });
              } else {
                resolve({
                  msg: "请求超时",
                  status: 1,
                });
              }
            }
          },
        });
      } else {
        resolve(requestResult.data);
      }

      // 处理timermap
      if (timerMap.has(requestFlag)) {
        let timer2 = timerMap.get(requestFlag);
        clearTimeout(timer2);
        timerMap.delete(requestFlag);
        if (timerMap.size == 0) {
          if (isShowLoading) {
            isShowLoading = false;
            wx.hideLoading();
          }
        }
      }
    }
  });
};

export function get(url, data = {}, header = {}) {
  return requestFunc({
    url,
    method: "GET",
    data,
    header,
  });
}

export function post(url, data = {}, header = {}) {
  return requestFunc({
    url,
    method: "POST",
    data,
    header,
  });
}

export function put(url, data = {}, header = {}) {
  return requestFunc({
    url,
    method: "PUT",
    data,
    header,
  });
}

export function formPost(url, data = "", header = {}) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: "POST",
      header: header,
      timeout: 10000,
      success: function (result) {
        resolve(result);
      },
      fail: function (result) {
        reject(result);
      },
    });
  });
}

export function getByAuth(url, data = "", header = {}) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: "GET",
      header: header,
      timeout: 10000,
      success: function (result) {
        resolve(result);
      },
      fail: function (result) {
        reject(result);
      },
    });
  });
}
