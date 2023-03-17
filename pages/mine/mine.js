var app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
Page({
  data: {
    usertype: "",
    userphone:"",
    direct30user: [],
    directuser: [],
    // 轮播头图
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },

  bvGoToShareValue() {
    if (app.globalData.Guserdata.UserInfo.PromoterLevel == "normal") {
      wx.showModal({
        title: '提示',
        content: '您尚未取得推广会员资格，是否转到资格购买页面？',
        success: function (res) {
          if (res.confirm) {
            console.log('确定')
            wx.navigateTo({
              url: '../mine/promoterorder',
            })
          } else if (res.cancel) {
            console.log('取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '../mine/sharevalue',
      })
    }
  },
  bvSubMessage(e) {
    wx.requestSubscribeMessage({ //获取下发权限
      tmplIds: ['Ap6SsQZ-fj8SZkyVv9ZvIg8EcJ5b1jgmMQko_o4LyAw', 'H4fK4iyDUqkVVxrd7RWuDQh5DOhoChTn8phqFGlfwRU', 'tXhFEK36Dqkasd9Cmmuh5EKZ6LZycrWfgn4xqBreQz4'],
      success: (res) => {

      }
    })
  },
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      usertype: app.globalData.Guserdata.UserInfo.UserType,
      userphone:app.globalData.Guserdata.UserInfo.UserPhone
    })
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        console.log(res.authSetting)
        // res.authSetting = {
        //   "scope.userInfo": true,
        //   "scope.userLocation": true
        // }
        console.log(res.subscriptionsSetting)
        // res.subscriptionsSetting = {
        //   mainSwitch: true, // 订阅消息总开关
        //   itemSettings: {   // 每一项开关
        //     SYS_MSG_TYPE_INTERACTIVE: 'accept', // 小游戏系统订阅消息
        //     SYS_MSG_TYPE_RANK: 'accept'
        //     zun-LzcQyW-edafCVvzPkK4de2Rllr1fFpw2A_x0oXE: 'reject', // 普通一次性订阅消息
        //     ke_OZC_66gZxALLcsuI7ilCJSP2OJ2vWo2ooUPpkWrw: 'ban',
        //   }
        // }
      }
    })
  },
  onShow: function () {
    startToTrack()
  },
})