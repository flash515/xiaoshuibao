var utils = require("../../utils/utils")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempinviterid: "",
    params: "",

    // 登录框相关变量
    loginshow: true,
    loginbtnshow: true,
    time: "获取验证码",
    currentTime: 60,
    disabledstatus: false,
    inputphone:"",
    s_phonecode: "",
    u_phonecode: "",

    remark: "活动登记",
  },
  bvInputPhone(e) {
    this.data.inputphone= e.detail.value
  },

  bvPhoneCode(e) {
    this.data.u_phonecode = e.detail.value
  },
  bvSendCode: async function () {
    if (this.data.inputphone == '') {
      utils._ErrorToast("请输入手机号码")
    } else {
      if (this.data.disabledstatus == false) {
        this.setData({
          disabledstatus: true
        })
        this._SendCodeBtn()
        this.data.s_phonecode = await utils._sendcode(this.data.inputphone)
        console.log("验证码", this.data.s_phonecode)
      }else{
        utils._ErrorToast("已发送，请等待")
      }
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
          disabledstatus: false
        })
      }
    }, 1000)
  },

  bvLogin: async function (e) {
    if (this.data.u_phonecode == this.data.s_phonecode && this.data.u_phonecode != "") {
      this.setData({
        loginshow: false,
        loginbtnshow:false,
      })
      utils._NewMember(this.data.inputphone)
      app.globalData.Guserdata.UserInfo.UserPhone=this.data.inputphone
    }else {
      utils._ErrorToast("验证码错误")
    }
    console.log(app.globalData.Guserdata)
  },
  onGetPhoneNumber(e) {
    console.log(e.detail)
    console.log(e.detail.code)
  },
 PhoneNumber(e) {
    var that = this;
    wx.login({
      success (res) {
        if (res.code) {
          console.log('步骤2获检查用户登录状态，获取用户电话号码！', res)
          wx.request({
            url: '这里写自己的接口',
            data: {code: res.code},
            success: function(res) {
              console.log("步骤三获取授权码，获取授权openid，session_key",res);
              var userphone=res.data.data;
              wx.setStorageSync('userphoneKey',userphone);
              //解密手机号
              var msg = e.detail.errMsg;
              var sessionID=wx.getStorageSync("userphoneKey").session_key;
              var encryptedData=e.detail.encryptedData;
              var iv=e.detail.iv;
              if (msg == 'getPhoneNumber:ok') {//这里表示获取授权成功
                wx.checkSession({
                  success:function(){
                        //这里进行请求服务端解密手机号
                    that.deciyption(sessionID,encryptedData,iv);
                  },
                  fail:function(){
                    // that.userlogin()
                  }
                })
              }
            },fail:function(res){
                console.log("fail",res);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      tempinviterid: options.userid,
      params: options,
    })
      // 通过分享进入，执行用户登录操作
      await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
    if (app.globalData.Guserdata.UserInfo.UserPhone != "") {
      this.setData({
        loginshow: false
      })
    }
    wx.hideLoading()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})