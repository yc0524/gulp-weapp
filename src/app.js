/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2022-01-05 14:55:11
 * @LastEditTime: 2022-01-11 09:07:48
 */
import './mixinPlugin/index';
import { checkUpdate, checkEnvChange } from '@utils/wx-util'
import {
  configure,
  when
} from 'mobx-miniprogram'
import userStore from '@store/userStore'

// 判断环境是否切换
const isEnvChange = checkEnvChange();


App({
  onLaunch() {
    checkUpdate();
    this.initDeviceInfo();
    wx.nextTick(() => {
      userStore.login()
    })
    when(
      () => !!userStore.isLogined,
      () => {
        // 获取用户基础信息
        userStore.getUserInfo();
        // 上报登录
      },
      {
        delay: 0
      }
    )
  },
  initDeviceInfo() {
    try {
      let deviceInfo = wx.getSystemInfoSync()
      this.globalData.deviceInfo = { ...deviceInfo }
      let menuInfo = wx.getMenuButtonBoundingClientRect()
      this.globalData.menuInfo = { ...menuInfo }
    } catch (e) {
      console.log(e);
    }
  },

  globalData: {
    deviceInfo: {},
    menuInfo: {},
    // 按钮分享信息挂载
    shareFromButton: {}
  }
})