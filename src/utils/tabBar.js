/**
 * @desc: 更改tabbar状态
 * @param {*} name tabbar名字 page 页面实例
 */
 export const setTabBarStatus = (page, name) => {
  if (typeof page.getTabBar === "function" && page.getTabBar()) {
    page.getTabBar().setData({
      selected: name,
    });
  }
};