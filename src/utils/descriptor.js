import userStore from '@store/userStore'


export function checkUserRegisterDecorator(tag, name, descriptor) {
  let func;
  if (descriptor.initializer) {
    func = descriptor.initializer();
    descriptor.initializer = function () {
      return function (...args) {
        if (!userStore.isUserRegisterFinished) {
          wx.navigateTo({
            url: "/pages/login/lindex",
          });

          wx.showToast({
            icon: "none",
            title: "请登录",
          });

          return {
            status: 1,
            msg: "请登录",
          };
        }

        return func.apply(this, args);
      };
    };
  } else if (descriptor.value) {
    if (typeof func == "function") {
      descriptor.value = function (...args) {
        if (!userStore.isUserRegisterFinished) {
          wx.navigateTo({
            url: "/pages/login/lindex",
          });

          wx.showToast({
            icon: "none",
            title: "请登录",
          });

          return {
            status: 1,
            msg: "请登录",
          };
        }
        return func.apply(this, args);
      };
    }
  }
}