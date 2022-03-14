/*
 * @Description: mixin
 * @Author: YanCheng
 * @Date: 2021-06-25 10:52:17
 * @LastEditTime: 2021-06-28 11:01:51
 */
import { reportVisitPage, reportVisitPagePath } from '../utils/report';

module.exports = {
  data: {
    visitPageTimer: null,
    reportPageData: null,
    reportScene: '', // 进入场景值
  },
  //  初始化report参数 传入id, type
  initPageEventData(data) {
    this.data.reportPageData = data;
  },
  // 上报事件
  reportPageEvent() {
    this.clearReportEvent();

    this.data.visitPageTimer = setInterval(() => {
      if (wx.getStorageSync('uid')) {
        const data = {
          scene: this.data.reportScene,
          ...this.data.reportPageData || {}
        }
        reportVisitPagePath(data);
        reportVisitPage();
        this.clearReportEvent();
      }
    }, 500)
  },
  // 清除定时器
  clearReportEvent() {
    const { visitPageTimer } = this.data;
    if (visitPageTimer) {
      clearInterval(visitPageTimer);
      this.data.visitPageTimer = null;
    }
  },
  onLoad() {
    // 获取进入场景值
    const data = wx.getEnterOptionsSync();
    this.data.reportScene = data.scene;
  },
  onReady() {
    this.reportPageEvent();
  },
  onUnload() {
    this.clearReportEvent();
  }
}