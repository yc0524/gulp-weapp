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
    QQ_MAP_KEY: "2GQBZ-RHJ6P-24BDL-LWRP3-BWH6H-FQBQT",
    QQ_MAP_SK: "C5YzO04BU0fnwy1aHQ7Jw0TCBoxaXmKm",
    API_URL: "http://8.134.14.57/rap2/app/mock/1/",
    AUTH_URL: "http://8.134.14.57/rap2/app/mock/1/",
    CLIENT_ID: "10047",
    CLIENT_SECRET:
      "7u1JVl1kpLSTub9VjMM8Qa3qbWi4ot8aplHUtVL20IYXYk4YgqoWi1EWrAyY4XWW",
    WS_URL: "wss://medasing-pre.singworld.cn",

    E5_BASE_PATH: "https://uc-pro.singworld.cn",
    E5_BIND_PATH: "https://auth-pro.singworld.cn",
    E5_LOGIN_PATH: "https://e5box-pro.singworld.cn",
    PRELOAD_TOKEN: "x_aam_dev__test",
  },
  dev: {
    QQ_MAP_KEY: "RGLBZ-UTOC3-VOO3L-Y2F4T-SSAU3-T6FI3",
    QQ_MAP_SK: "5D0TYsmFMprWVINVhgft6ncRTL7UBenn",
    API_URL: "http://medasing.aam.test",
    AUTH_URL: "http://auth2.aam.test",
    CLIENT_ID: "10209",
    CLIENT_SECRET:
      "v8a8Do97LqflNxPceenYE2KGguY7zyVQZjYsXionzg35634M8wGOXt9tmuQ0q2wd",
    WS_URL: "ws://medasing.aam.test",

    E5_BASE_PATH: "http://user-test.singworld.net",
    E5_BIND_PATH: "http://auth-test.singworld.net",
    E5_LOGIN_PATH: "http://e5box-server.aam.test",

    BIG_DATA_PATH: "https://10.0.2.39:8181",
    PRELOAD_TOKEN: "x_aam_dev__test",
  },
  prev: {
    QQ_MAP_KEY: "2GQBZ-RHJ6P-24BDL-LWRP3-BWH6H-FQBQT",
    QQ_MAP_SK: "C5YzO04BU0fnwy1aHQ7Jw0TCBoxaXmKm",
    API_URL: "https://medasing-pre.singworld.cn",
    AUTH_URL: "https://auth.singworld.cn",
    CLIENT_ID: "10047",
    CLIENT_SECRET:
      "7u1JVl1kpLSTub9VjMM8Qa3qbWi4ot8aplHUtVL20IYXYk4YgqoWi1EWrAyY4XWW",
    WS_URL: "wss://medasing-pre.singworld.cn",

    E5_BASE_PATH: "https://uc-api.singworld.cn",
    E5_BIND_PATH: "https://auth.singworld.cn",
    E5_LOGIN_PATH: "https://e5box-pre.singworld.cn",

    BIG_DATA_PATH: "https://bigdata-collector.singworld.net",
    PRELOAD_TOKEN: "x_aam_dev__pre",
  },
  prod: {
    QQ_MAP_KEY: "2GQBZ-RHJ6P-24BDL-LWRP3-BWH6H-FQBQT",
    QQ_MAP_SK: "C5YzO04BU0fnwy1aHQ7Jw0TCBoxaXmKm",
    API_URL: "https://medasing-pro.singworld.cn",
    AUTH_URL: "https://auth-pro.singworld.cn",
    CLIENT_ID: "10035",
    CLIENT_SECRET:
      "VIJSWAwpTsvYjsJi2gNszTnCmoy8WsTIcAWqBYvC9wJn3ivAfXXq5pC2k8wx2psq",
    WS_URL: "wss://medasing-pro.singworld.cn",

    E5_BASE_PATH: "https://uc-pro.singworld.cn",
    E5_BIND_PATH: "https://auth-pro.singworld.cn",
    E5_LOGIN_PATH: "https://e5box-pro.singworld.cn",

    BIG_DATA_PATH: "https://bigdata-collector.singworld.cn",
    PRELOAD_TOKEN: "x_aam_dev__pro",
  },
};
