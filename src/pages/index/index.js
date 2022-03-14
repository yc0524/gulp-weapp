/*
 * @Description:
 * @Author: YanCheng
 * @Date: 2022-01-10 16:54:00
 * @LastEditTime: 2022-01-10 16:54:01
 */
import { setTabBarStatus } from '../../utils/tabBar'
Page({
  onShow() {
    setTabBarStatus(this, 'home');
  }
});
