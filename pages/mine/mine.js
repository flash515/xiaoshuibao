var app = getApp()
const track = require("../../utils/track");
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
      success: res => {
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
      	// 点击 tab 时用此方法触发埋点
	onTabItemTap: () => track.startToTrack(),
  onShow: function () {
    track.startToTrack()
  },
  handlerClick(e) {track.startByClick(e.currentTarget.id);},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    track.startByBack()
  },
})
