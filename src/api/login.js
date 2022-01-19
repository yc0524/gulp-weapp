/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2022-01-12 18:00:54
 * @LastEditTime: 2022-01-13 10:14:26
 */
import { get, post } from "./axios";

const AUTH_URL = "/* @echo AUTH_URL */";
const CLIENT_ID = "/* @echo CLIENT_ID */";
const CLIENT_SECRET = "/* @echo CLIENT_SECRET */";

/**
 *
 * @param {String} code 绑定微信用户信息
 */
export function getProfile({ encryptedData = "", iv = "" }) {
  const url = `${AUTH_URL}/api/miniprogram/profile`;
  const data = {
    encrypted_data: encryptedData,
    iv: iv,
  };

  return post(url, {
    data,
  });
}

/**
 * @desc 获取token
 * @param {String} code 微信用户的code
 * @returns
 */

export const getToken = (code) => {
  const url = `${AUTH_URL}/connect/token`;
  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grand_type: "miniprogram",
    code,
  };
  return post(url, data, {
    "Content-Type": "application/x-www-form-urlencoded",
  });
};

/**
 * 刷新用户token
 * @param {s} params
 * @returns
 */

export function refreshToken({ refresh_token }) {
  const url = `${AUTH_URL}/connect/token`;
  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refresh_token,
  };

  return post(url, data, {
    "Content-Type": "application/x-www-form-urlencoded",
  });
}

/**
 * @desc 绑定手机号
 */
export function bindPhone(data) {
  const url = `${AUTH_URL}/bind/phone/miniprogram`;
  return post(url, data);
}
