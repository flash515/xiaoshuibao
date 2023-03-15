const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
var {
  _PLcheck,
  _pointshistory,
  _balanceupdate,
} = require("../../utils/initialize")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userid: "",
    userphone: "",
    tradebalance: 0,
    promotebalance: 0,
    consumepoints:0,
    exchangepoints: 0,
    withdrawpoints:0,
    packetnumber:0,
    balanceupdatetime: "",
    consumehistory: [],
    tradehistory: [],
    promotehistory: [],

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
  bvExchangePoints(e) {
    this.setData({
      exchangepoints: e.detail.count,
    })
  },
  bvPromotePointsShare: async function (e) {

  },
  bvTradePointsExchange: async function (e) {
    // 兑换前check一下balance
    this._balancecheck()
    const db = wx.cloud.database()
    db.collection("POINTS").add({
      data: {
        PointsType: "Exchange",
        ProductId: this.data.productid,
        ProductName: "消费积分兑换",
        // 使用的消费积分
        ExchangeId: app.globalData.Guserid,
        ExchangePoints: this.data.exchangepoints,
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString('chinese', {
          hour12: false
        }),
        PointsStatus: "checked",
      },
      success(res) {
        // 兑换后更新一下balance
        this._balancecheck()
      },
      fail(res) {
        wx.showToast({
          title: '提交失败请重试',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      }
    })

  },
  bvTradePointsWithdraw: async function (e) {

  },

  bvBalanceCheck: async function (e) {

    if (new Date().getTime() < (new Date(this.data.balanceupdatetime).getTime() + 600000)) {
      wx.showToast({
        title: '间隔少于10分钟',
        icon: 'error',
        duration: 2000
      })

    } else {
      this._balancecheck()
    }
  },
  async _balancecheck() {
    let res = await _pointshistory()
    console.log("积分记录", res)
    this.setData({
      promotehistory: res[0],
      tradehistory: res[1],
    })
    // 积分求和

    let promotepoints = 0
    let tradepoints = 0

    if (res[0].length != 0) {
      for (let i = 0; i < res[0].length; i++) {
        if (res[0][i].RegistrantId == app.globalData.Guserid) {
          promotepoints = promotepoints + res[0][i].RegistrantPoints
        } else if (res[0][i].InviterId == app.globalData.Guserid) {
          promotepoints = promotepoints + res[0][i].InviterPoints
        } else if (res[0][i].IndirectInviterId == app.globalData.Guserid) {
          promotepoints = promotepoints + res[0][i].IndirectInviterPoints
        } else if (res[0][i].ConsumeId == app.globalData.Guserid) {
          promotepoints = promotepoints - res[0][i].ConsumePoints
        }
      }
      console.log(promotepoints)
    }

    if (res[1].length != 0) {
      for (let i = 0; i < res[1].length; i++) {
        if (res[1][i].InviterId == app.globalData.Guserid) {
          tradepoints = tradepoints + res[1][i].InviterPoints
        } else if (res[1][i].IndirectInviterId == app.globalData.Guserid) {
          tradepoints = tradepoints + res[1][i].IndirectInviterPoints
        }
      }
      console.log(tradepoints)

    }
    this.setData({
      promotebalance: promotepoints,
      tradebalance: tradepoints,
    })
    this.setData({
      balanceupdatetime: new Date().toLocaleString('chinese', {
        hour12: false
      })
    })
    _balanceupdate(this.data.promotebalance, this.data.tradebalance, this.data.balanceupdatetime)
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: async function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      userid: app.globalData.Guserid,
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,
      promotebalance: app.globalData.Guserdata.TradeInfo.PromoteBalance,
      tradebalance: app.globalData.Guserdata.TradeInfo.TradeBalance,
      balanceupdatetime: app.globalData.Guserdata.TradeInfo.BalanceUpdateTime,
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