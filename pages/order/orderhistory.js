// pages/order/orderhistory.js
const app = getApp()
const utils= require("../../utils/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 登录框相关变量
    loginshow: false,
    loginbtnshow: false,
    time: "获取验证码",
    currentTime: 60,
    disabledstatus: false,
    inputphone:"",
    s_phonecode: "",
    u_phonecode: "",

    orderhistory:[],
    discounthistory:[],
    promoterhistory:[],
    // 轮播参数
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
  bvLoginShow: function (e) {
    this.setData({
      loginshow: true
    })
  },

  bvInputPhone(e) {
    this.data.inputphone= e.detail.value
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
    var interval = setInterval(function () {
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

  bvPhoneCode(e) {
    this.data.u_phonecode= e.detail.value
  },

  bvLogin: async function (e) {
    if(this.data.inputphone=="998189" && this.data.u_phonecode=="981899"){
      // 使用测试账号登录
      this.setData({
        loginshow: false,
        loginbtnshow:false,
      })
      utils._NewMember(this.data.inputphone)
      app.globalData.Guserdata.UserInfo.UserPhone=this.data.inputphone
    }else{
    if (this.data.u_phonecode == this.data.s_phonecode && this.data.u_phonecode != "") {
      this.setData({
        loginshow: false,
        loginbtnshow:false,
      })
      utils._NewMember(this.data.inputphone)
      utils._RegistPointsAdd()
      utils._SendNewUserSMS()
      app.globalData.Guserdata.UserInfo.UserPhone=this.data.inputphone
    }else {
      utils._ErrorToast("验证码错误")
    }
    console.log(app.globalData.Guserdata)
  }
  },
  
  onHideMaskTap: function () {
    this.setData({
      loginshow: false
    })
  },
  
  bvOrdertDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../order/orderdetail?id=' + e.currentTarget.dataset.id
    })
  },
  bvToPay(e) {
    wx.navigateTo({
      url: '../order/pay?orderid=' + e.currentTarget.dataset.orderid + '&productid=' + e.currentTarget.dataset.productid+ '&productname=' + e.currentTarget.dataset.productname + '&totalfee=' + e.currentTarget.dataset.totalfee+'&database='+e.currentTarget.dataset.database
    })
  },
  bvRefresh(e){
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: e.currentTarget.dataset.name,
        command: "and",
        where: [{
          UserId: app.globalData.Guserid
        }]
      },
      success: res => {
if(e.currentTarget.dataset.name=="ORDER"){
          this.setData({
            orderhistory: res.result.data
          })
        }
        else if(e.currentTarget.dataset.name=="DISCOUNTORDER"){
          this.setData({
            discounthistory: res.result.data
          })
        }
        else if(e.currentTarget.dataset.name=="PROMOTERORDER"){
          this.setData({
            promoterhistory: res.result.data
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({image:app.globalData.Gimagearray})
    if(app.globalData.Guserdata.UserInfo.UserPhone!=''){
      //loginbtnshow已赋值
    }else{
      this.setData({
        loginbtnshow: true
      })
    }
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "DISCOUNTORDER",
        command: "and",
        where: [{
          UserId: app.globalData.Guserid
        }]
      },
      success: res => {
        this.setData({
          discounthistory: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "ORDER",
        command: "and",
        where: [{
          UserId: app.globalData.Guserid
        }]
      },
      success: res => {
        this.setData({
          orderhistory: res.result.data
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "PROMOTERORDER",
        command: "and",
        where: [{
          UserId: app.globalData.Guserid
        }]
      },
      success: res => {
        this.setData({
          promoterhistory: res.result.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */

  onShow: function () {


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
})