/**
 * 微信相关工具函数
 */
// 检查更新
export const checkUpdate = () => {
  const updateManager = wx.getUpdateManager()
  if (updateManager) {
    updateManager.onCheckForUpdate(res => {
      if (res.hasUpdate) {
        wx.showLoading({
          title: '正在下载新版本',
          mask: true
        })
      }
    })

    updateManager.onUpdateReady(() => {
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(() => {
      wx.hideLoading()
      wx.showModal({
        title: '新版本下载失败',
        content: '请检查你的网络状况，然后重启小程序。',
        showCancel: false
      })
    })
  }
}

// 检测环境是否变化，是的话清掉缓存，返回true, 否则返回false
export const checkEnvChange = () => {
  const envStr = "/* @echo ENV */";
  function onEnvChange() {
    wx.clearStorageSync();
    wx.setStorage({
      key: "env",
      data: envStr
    })
  }
  // 判断环境切换，清除缓存数据
  try {
    let env = wx.getStorageSync('env') || '';
    if (envStr != env) {
      onEnvChange();
      return true;
    }
    return false
  } catch (e) {
    onEnvChange();
    return true;
  }
}