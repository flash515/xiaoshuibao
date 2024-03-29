const promisic = function (n) {
    return function (t = {}) {
      return new Promise((c, r) => {
        const s = Object.assign(t, {
          success: n => {
            c(n)
          },
          fail: n => {
            r(n)
          }
        });
        n(s)
      })
    }
  },
  px2rpx = function (n) {
    const {
      screenWidth: t
    } = wx.getSystemInfoSync();
    return 750 / t * n
  };
export {
  promisic,
  px2rpx
};