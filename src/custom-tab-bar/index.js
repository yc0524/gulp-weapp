/*
 * @Description: 
 * @Author: YanCheng
 * @Date: 2021-04-28 13:39:19
 * @LastEditTime: 2021-12-03 17:01:31
 */
let timer;

Component({
  data: {
    actionSheetVisible: false,
    fixBottom: 0,
    selected: 'home',
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
        pagePath: "/pages/index/index",
        iconPath: "/public/tabbar/home.png",
        selectedIconPath: "/public/tabbar/home_active.png",
        text: "首页",
        name: 'home',
        style: 'width:46rpx;height:47rpx;margin-bottom:8rpx'
      },
      {
        pagePath: "/pages/discover/index",
        iconPath: "/public/tabbar/discover.png",
        selectedIconPath: "/public/tabbar/discover_active.png",
        text: "广场",
        name: 'discover',
        style: 'width:57rpx;height:44rpx;margin-bottom:12rpx'
      },
      {
        pagePath: "/pages/mine/index",
        iconPath: "/public/tabbar/mine.png",
        selectedIconPath: "/public/tabbar/mine_active.png",
        text: "我的",
        name: 'mine',
        style: 'width:43rpx;height:43rpx;margin-bottom:12rpx'
      }
    ]
  },
  ready() {
    const { statusBarHeight, model, platform } = wx.getSystemInfoSync()
    const isIOS = platform === 'ios' || /iPhone/.test(model)
    if (isIOS && statusBarHeight >= 44) {
      this.setData({
        fixBottom: 34
      })
    }
  },
  detached() {
    if (timer) {
      clearTimeout(timer);
    }
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const url = data.path;
      wx.switchTab({ url });
      wx.nextTick(() => {
        this.setData({
          selected: data.name
        });
      })
    },
  }
})