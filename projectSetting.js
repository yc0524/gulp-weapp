/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2022-01-06 16:29:36
 * @LastEditTime: 2022-01-06 16:29:36
 */
// 引用的方式

//   js文件中
//   const API_URL = "/* @echo API_URL */"

module.exports = {
  mock: {
    CLIENT_ID: "10226",
    CLIENT_SECRET: "XrtzhwuSAd6heDZ0tHBxFq6Pysq3N267L1vqkgnBsUje9FqBZonjaaWDcXMm8biA",
    AUTH_SERVICE: 'http://auth2.aam.test', // 认证服务
    USER_SERVICE: 'http://user.aam.test', // 用户中心服务
    MINI_SERVICE: '', // 咪哒主要业务服务
    OMS_SERVICE: 'http://oms-back-end-outside.aam.test', // 资源位服务
    QI_NIU_DOMAIN: 'https://upload-z2.qiniup.com', // 七牛上传服务
    QI_NIU_TOKEN_URL: 'http://oms-token.aam.test', // 获取七牛token服务
    ENV: 'mock',
  },
  dev: {
    CLIENT_ID: "10226",
    CLIENT_SECRET: "XrtzhwuSAd6heDZ0tHBxFq6Pysq3N267L1vqkgnBsUje9FqBZonjaaWDcXMm8biA",
    AUTH_SERVICE: 'http://auth2.aam.test', // 认证服务
    USER_SERVICE: 'http://user.aam.test', // 用户中心服务
    MINI_SERVICE: '', // 咪哒主要业务服务
    OMS_SERVICE: 'http://oms-back-end-outside.aam.test', // 资源位服务
    QI_NIU_DOMAIN: 'https://upload-z2.qiniup.com', // 七牛上传服务
    QI_NIU_TOKEN_URL: 'http://oms-token.aam.test', // 获取七牛token服务
    ENV: 'dev',
  },
  prev: {
    CLIENT_ID: "10058",
    CLIENT_SECRET: "StOfGOILa0u1wXnEw1GDGuvdSewj77Ax7Tlfj84Qyu6uRn8CTECWzT5s4ZJHd0Tx",
    AUTH_SERVICE: 'https://auth.singworld.cn', // 认证服务
    USER_SERVICE: 'https://uc-api.singworld.cn', // 用户中心服务
    MINI_SERVICE: '', // 咪哒主要业务服务
    OMS_SERVICE: 'https://oms-back-end-outside.singworld.cn', // 资源位服务
    QI_NIU_DOMAIN: 'https://upload-z2.qiniup.com', // 七牛上传服务
    QI_NIU_TOKEN_URL: 'https://oms-token-pro.singworld.cn', // 获取七牛token服务
    ENV: 'pre',
  },
  prod: {
    CLIENT_ID: "10226",
    CLIENT_SECRET: "XrtzhwuSAd6heDZ0tHBxFq6Pysq3N267L1vqkgnBsUje9FqBZonjaaWDcXMm8biA",
    AUTH_SERVICE: 'https://auth-pro.singworld.cn', // 认证服务
    USER_SERVICE: 'https://uc-pro.singworld.cn', // 用户中心服务
    MINI_SERVICE: '', // 咪哒主要业务服务
    OMS_SERVICE: 'https://oms-pro-back-end-outside.singworld.cn', // 资源位服务
    QI_NIU_DOMAIN: 'https://upload-z2.qiniup.com', // 七牛上传服务
    QI_NIU_TOKEN_URL: 'https://oms-token-pro.singworld.cn', // 获取七牛token服务
    ENV: 'production',
  },
};
