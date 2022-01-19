/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2021-03-25 10:23:30
 * @LastEditTime: 2022-01-12 15:43:44
 */

/**
 * @description: 拼接跳转参数，queryString
 * @param {*} url  url
 * @param {*} params 入参
 * @return {*}
 */
export function setUrlQuery(url, params = {}) {
  if (!url) return "";

  if (params) {
    const paramsArray = [];
    Object.keys(params).forEach((key) => {
      return params[key] && paramsArray.push(`${key}=${params[key]}`);
    });
    if (url.search(/\?/) === -1) {
      url += `?${paramsArray.join("&")}`;
    } else {
      url += `&${paramsArray.join("&")}`;
    }
    return url;
  }
}
// 延迟
export function sleep(time = 1000) {
  return new Promise((resolve) => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      resolve(0);
    }, time);
  });
}

// 参数过滤，将null undefined过滤，空字符串不过滤

export function paramsFilter(params = {}) {
  let result = {};
  for (let key in params) {
    if (params[key] !== null && params[key] !== undefined) {
      result[key] = params[key];
    }
  }

  return result;
}

export function isPhone(str = "") {
  str = str + "";
  let phoneRex =
    /^[1](([3][0-9])|([4][0,1,4-9])|([5][0-3,5-9])|([6][2,5,6,7])|([7][0-8])|([8][0-9])|([9][0-3,5-9]))[0-9]{8}$/;
  return phoneRex.test(str);
}

/*函数节流*/
export function throttle(fn, wait) {
  var timer = null;
  var last = null;
  return function () {
    var context = this;
    var args = arguments;
    last = [...args];
    if (!timer) {
      timer = setTimeout(function () {
        fn.call(context, ...last);
        timer = null;
        // last = null;
      }, wait);
    }
  };
}

/*函数防抖*/
export function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000;
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments;
    timer = setTimeout(function () {
      fn.call(context, ...args);
    }, gapTime);
  };
}

// 时间格式化
export function dateFormat(fmt, date) {
  let ret;
  const opt = {
    "Y+": date.getFullYear().toString(), // 年
    "m+": (date.getMonth() + 1).toString(), // 月
    "d+": date.getDate().toString(), // 日
    "H+": date.getHours().toString(), // 时
    "M+": date.getMinutes().toString(), // 分
    "S+": date.getSeconds().toString(), // 秒
    "s+": date.getMilliseconds().toString(),
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
      );
    }
  }
  return fmt;
}

export function queryStringParse(url) {
  if (typeof url !== "string") {
    return {};
  }

  let paramsStr = url.split("?")[1];
  if (!paramsStr) {
    return {};
  }

  let result = {};
  let paramsArr = paramsStr.split("&");
  paramsArr.forEach((item) => {
    let target = item.split("=");
    let key = target[0];
    let value = target[1];
    result[key] = value;
  });

  return result;
}

export function chunk(arr, size) {
  var size = size || 1;
  //
  var result = [];

  var l = arr.length; //数组的长度
  var s = Math.ceil(l / size); //  假如我们有长度为10的数组，size传入的是3，是要分成4个自数组的。
  for (var i = 0; i < s; i++) {
    result[i] = arr.slice(size * i, size * (i + 1));
  }
  return result;
}
export async function arrayLoader(array, cb, limit) {
  // let chunkArr = chunk(array, limit)

  let chunkArr = [];
  if (array.length <= limit) {
    chunkArr[0] = array;
  } else {
    chunkArr[0] = array.slice(0, limit);
    chunkArr[1] = array.slice(limit, array.length);
  }
  cb && cb(chunkArr[0] || [], true);
  if (chunkArr.length > 1) {
    await sleep(300);
    cb && cb(chunkArr[1] || []);
  }
}

export async function listLoader(array, limit, cb) {
  let chunkArr = chunk(array, limit);
  for (let index = 0; index < chunkArr.length; index++) {
    const element = chunkArr[index];
    cb && cb(element, index);
    await sleep(50);
  }
}

export function numberFormat(number) {
  if (typeof number != "number") {
    return 0;
  }
  if (number < 10000) {
    return number;
  } else {
    let result = parseInt(number / 10000, 10);
    return result + "W";
  }
}

export function getNetworkTypeByPromise() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success(res) {
        resolve(res);
      },
    });
  });
}

export function getCurPageRoute() {
  let pages = getCurrentPages();
  let currentPage = pages[pages.length - 1];
  let route = currentPage.route;
  let params = currentPage.options;
  let keys = Object.keys(params);

  if (keys.length > 0) {
    return setUrlQuery(route, params);
  } else {
    return route;
  }
}

export function createSetDataArray({ list, data, listKey }) {
  let localLen = list.length;
  let dataLen = data.length;

  let result = {};
  data.forEach((item, index) => {
    let key = `${listKey}[${localLen + index}]`;
    result[key] = item;
  });
  return result;
}

export function arrayAppend(newArr, key, context) {
  let len = context["data"][key].length;
  let params = {};
  newArr = Array.isArray(newArr) ? newArr : [];
  newArr.forEach((item, index) => {
    let keys = `${key}[${len + index}]`;
    params[keys] = item;
  });
  context.setData(params);
}

export function getMax(arr, prop) {
  var max;
  for (var i = 0; i < arr.length; i++) {
    if (max == null || parseInt(arr[i][prop]) > parseInt(max[prop]))
      max = arr[i];
  }
  return max;
}
// 过滤特殊字符，以及表情，以及所有空格
export function replaceLetter(str) {
  // 过滤空字符
  let a = str.replace(/\s*/g, "");
  // 过滤表情
  a = a.replace(
    /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/,
    ""
  );
  //过滤特殊符号
  a = a.replace(
    /[`~!@#$%^&*()+=|{}':;',\[\].<>/?~！@#￥%……&*（）——+|{}【】‘；：”“’。，、？]/,
    ""
  );
  return a;
}

export function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

export function randNumberMaker(bits) {
  var Num = "";
  for (var i = 0; i < bits; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}

export function getStateFormScrollToBottomLoad({
  list = [],
  pageSize = 10,
  pageNum = 0,
}) {
  let isNoData = false;
  let isNoMore = false;
  list = Array.isArray(list) ? list : [];
  if (list.length == 0 && pageNum == 1) {
    isNoData = true;
  }
  // let condition1 =  && pageNum > 1
  // let condition2 = list.length < pageSize && pageNum == 1
  // if (condition1 || condition2) {
  //   isNoMore = list.length < 10
  // }

  isNoMore = list.length < pageSize;

  let isFixed = false;
  if (pageNum == 1 && list.length < 5) {
    isFixed = true;
  }
  return {
    isNoData,
    isNoMore,
    isFixed,
  };
}

let canUseReportPerformance = undefined;

export function wxReportPerformance(...args) {
  if (typeof canUseReportPerformance === "undefined") {
    canUseReportPerformance = wx.canIUse("reportPerformance");
  }
  wx.reportPerformance(...args);
}
