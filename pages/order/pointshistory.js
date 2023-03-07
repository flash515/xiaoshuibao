const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
var {
  _pointscheck,
  _balanceupdate,
} = require("../../utils/initialize")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userphone: "",
    tradepoints: 0,
    promoterpoints: 0,
    balanceupdatetime: "",
    pointshistory: [],
    tradehistory: [],
    promoterhistory: [],
    Points: 0,
    inviterpoints: 0,
    indirectinviterpoints: 0,
    consumepoints: 0,
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

  bvRefresh: async function (e) {
    await _pointscheck().then(
      console.log("刷新执行了") ,
      wx.getStorage({
        key: 'LPoints',
        success: res => {
          console.log(res.data)
          var temppoints1 = [];
          var temppoints2 = [];
          var temppoints3 = [];
          var temppoints4 = [];
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].RegistrantId == app.globalData.Guserid || [res.data[i].InviterId == app.globalData.Guserid && res.data[i].InviterPoints != "" && res.data[i].InviterPoints != undefined] || [res.data[i].IndirectInviterId == app.globalData.Guserid && res.data[i].IndirectInviterPoints != "" && res.data[i].IndirectInviterPoints != undefined]) {
              temppoints1.push(res.data[i]);
            }
          }
          this.setData({
            promoterhistory: temppoints1
          })
          for (var i = 0; i < res.data.length; i++) {
            if ([res.data[i].InviterId == app.globalData.Guserid && res.data[i].SliverPoints != "" && res.data[i].SliverPoints != undefined] || [res.data[i].IndirectInviterId == app.globalData.Guserid && res.data[i].PlatinumPoints != "" && res.data[i].PlatinumPoints != undefined]) {
              temppoints2.push(res.data[i]);
            }
          }
          this.setData({
            tradehistory: temppoints2
          })
        }
      })
    )
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,
      balance: app.globalData.Guserdata.TradeInfo.Balance,
      balanceupdatetime: app.globalData.Guserdata.TradeInfo.BalanceUpdateTime,
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "and",
        where: [{
          RegistrantId: app.globalData.Guserid,
          PointsStatus: 'checked',
        }]
      },
      success: res => {
        this.setData({
          personalhistory: res.result.data,
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "and",
        where: [{
          InviterId: app.globalData.Guserid,
          PointsStatus: 'checked',
        }]
      },
      success: res => {
        this.setData({
          inviterhistory: res.result.data,
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "and",
        where: [{
          IndirectInviterId: app.globalData.Guserid,
          PointsStatus: 'checked',
        }]
      },
      success: res => {
        this.setData({
          indirectinviterhistory: res.result.data,
        })
      }
    })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "and",
        where: [{
          ConsumeId: app.globalData.Guserid,
          PointsStatus: 'checked',
        }]
      },
      success: res => {
        this.setData({
          consumehistory: res.result.data,
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
  // 点击 tab 时用此方法触发埋点
  onTabItemTap: () => startToTrack(),
  onShow: function () {
    this.setData({
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,
      image: app.globalData.Gimagearray
    })
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})