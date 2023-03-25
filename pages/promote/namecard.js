const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 登录参数
    time: "获取验证码",
    currentTime: 60,
    disabled: false,
    s_phonecode: "",
    u_phonecode: "",
    // 名片参数
    cardshow: true,
    namecardbg: "https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/namecard/bg2.jpg?sign=993ee89f0c2e6992d2eb21e8c7f433c5&t=1679737354",

    invitercompanyname: "",
    inviterusername: "",
    bankshow: "",
    bank: "",
    account: "",
    companyname: "",
    companyid: "",
    businessscope: "",
    companyscale: "",
    username: "",
    userphone: "",
    useroldphone: "",
    result: "未发送",
    balance: "",
    usertype: "",
    adddate: "",
    updatedate: ""
  },

  bvUserPhone(e) {
    this.setData({
      userphone: e.detail.value
    })
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
  bvSendCode() {
    if (this.data.userphone == "" || this.data.userphone == undefined) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'error',
        duration: 2000
      })
    } else {
      let _this = this;

      this.setData({
        disabled: true
      })
      wx.cloud.callFunction({
        name: 'sendmessage',
        data: {
          templateId: "985130",
          nocode: false,
          mobile: _this.data.userphone,
          nationcode: '86'
        },
        success: res => {
          let code = res.result.res.body.params[0];
          let result = res.errMsg;
          if (result == "cloud.callFunction:ok") {
            _this.setData({
              result: "发送成功",
              s_phonecode: code
            })
            this._SendCodeBtn()
          } else {
            _this.setData({
              result: "发送失败"
            })
          }
        },
        fail: err => {
          console.error('[云函数] [sendsms] 调用失败', err)
        }
      })
    }
  },
  bvPhoneCode(e) {
    this.setData({
      u_phonecode: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    this.setData({
      tempinviterid: options.userid,
      params: options,
    })
    if (options.userid != '' && options.userid != undefined) {
      // 从推广名片进入，显示推广人的名片
      let user = await utils._usercheck(options.userid)
      this.setData({
        companyname: user.UserInfo.CompanyName,
        businessscope: user.UserInfo.BusinessScope,
        username: user.UserInfo.UserName,
        userphone: user.UserInfo.UserPhone,
      })
      // 调用方法初始化
      utils._setting()
      utils._productcheck()
      await utils._login()
      let data = await utils._usercheck(app.globalData.Guserid)
      console.log("data", data);
      if (data.length == 0) {
        await utils._newuser(this.data.tempinviterid, this.data.params, this.data.remark)
        await utils._invitercheck()
      } else {
        app.globalData.Guserdata = data[0]
        app.globalData.Gindirectinviterid = data[0].UserInfo.IndirectInviterId
        app.globalData.Ginviterid = data[0].UserInfo.InviterId
        app.globalData.Ginviterphone = data[0].UserInfo.InviterPhone
        console.log("当前用户信息", app.globalData.Guserdata);
      }
    } else {
      // 是从小程序打开，显示本人的名片信息
      this.setData({
        image: app.globalData.Gimagearray,
        avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
        nickname: app.globalData.Guserdata.UserInfo.nickName,
        companyname: app.globalData.Guserdata.UserInfo.CompanyName,
        companyid: app.globalData.Guserdata.UserInfo.CompanyId,
        businessscope: app.globalData.Guserdata.UserInfo.BusinessScope,
        companyscale: app.globalData.Guserdata.UserInfo.CompanyScale,
        username: app.globalData.Guserdata.UserInfo.UserName,
        bank: app.globalData.Guserdata.UserInfo.Bank,
        account: app.globalData.Guserdata.UserInfo.Account,
        bankshow: app.globalData.Guserdata.UserInfo.UserPhone,
        userphone: app.globalData.Guserdata.UserInfo.UserPhone,
        useroldphone: app.globalData.Guserdata.UserInfo.UserPhone,
        usertype: app.globalData.Guserdata.UserInfo.UserType,
        adddate: app.globalData.Guserdata.UserInfo.AddDate,
        updatedate: app.globalData.Guserdata.UserInfo.UpdateDate,
        invitercompany: app.globalData.Guserdata.UserInfo.InviterCompany,
        invitername: app.globalData.Guserdata.UserInfo.InviterName,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // 点击 tab 时用此方法触发埋点
  onTabItemTap: () => startToTrack(),
  onShow: function () {
    startToTrack()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    startByBack()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.Guserdata.UserInfo.nickName + '推荐给您：',
      path: '/pages/promote/namecard?userid=' + app.globalData.Guserid,
      imageUrl: '', //封面，留空自动抓取500*400生成图片，真机有效，电脑调试会抓取整个页面
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(this.data.path.value)
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
  }
})