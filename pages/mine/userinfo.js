const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const utils = require("../../utils/utils");
var interval = null //倒计时函数
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 轮播参数
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    // 用户信息

    avatarurl: "",
    nickname: "",
    userphone: "",
    useroldphone: "",
    time: "获取验证码",
    currentTime: 60,
    disabled: false,
    s_phonecode: "",
    u_phonecode: "",
    inviteravatar: "",
    inviternickname: "",
    adddate: "",
    updatedate: "",
  },

  onChooseAvatar(e) {

    console.log(e.detail)
    const cloudPath = 'user/' + app.globalData.Guserid + '/' + "avatarUrl" + e.detail.avatarUrl.match(/\.[^.]+?$/)
    wx.cloud.uploadFile({
      cloudPath, // 上传至云端的路径
      filePath: e.detail.avatarUrl, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log(res.fileID)
        // do something
        this.setData({
          avatarurl: res.fileID,
        })
      },
      fail: console.error
    })
  },
  bvNickName(e) {
    console.log("真机测试才能获取到", e.detail.value)
    this.setData({
      nickname: e.detail.value,
    })
  },

  bvUserPhone(e) {
    this.data.userphone = e.detail.value
    console.log(this.data.userphone)
  },
  bvPhoneCode(e) {
    this.data.u_phonecode = e.detail.value
  },

  bvSendCode: async function () {
    this.data.s_phonecode = await utils._sendcode(this.data.userphone)
    console.log("验证码", this.data.s_phonecode)
    if (this.data.s_phonecode != '' && this.data.s_phonecode != undefined) {
      this._SendCodeBtn()
    }
  },
  _SendCodeBtn() {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,
      useroldphone: app.globalData.Guserdata.UserInfo.UserPhone,
      avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickname: app.globalData.Guserdata.UserInfo.nickName,
      adddate: app.globalData.Guserdata.UserInfo.AddDate,
      updatedate: app.globalData.Guserdata.UserInfo.UpdateDate,
      inviteravatar: app.globalData.Guserdata.UserInfo.InviterAvatar,
      inviternickname: app.globalData.Guserdata.UserInfo.InviterNickName,
    })
    if(this.data.avatarurl==""){
      this.setData({
        avatarurl:defaultAvatarUrl
      })
    }
  },

  //修改数据操作
  async UpdateData(e) {
    if (this.data.s_phonecode == this.data.u_phonecode && this.data.u_phonecode != "") {
      console.log('手机验证码正确')
      const db = wx.cloud.database()
     db.collection('USER').where({
        UserId: app.globalData.Guserid
      }).update({
        data: {
          ["UserInfo.UserPhone"]: this.data.userphone,
          ["TradeInfo.MemberTime"]: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          ["UserInfo.avatarUrl"]: this.data.avatarurl,
          ["UserInfo.nickName"]: this.data.nickname,
        },
        success: res => {
          utils._SuccessToast("信息更新成功")
          // 根据用户是否已验证手机号，提供首次验证积分
          if (this.data.useroldphone == "") {
            utils._RegistPointsAdd()
            utils._SendNewUserSMS()
          }
        },
      })
    } else {
      utils._ErrorToast("验证码错误")
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},
  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})