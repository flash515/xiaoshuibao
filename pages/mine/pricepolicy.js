const { dateLater } = require("../../utils/getDates.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播参数
    image: [],
    startdate: "",
    pl3startdate:"",
    pl3enddate:"",
    pl2startdate:"",
    pl2enddate:"",
    pl1startdate:"",
    pl1enddate:"",
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    windowW: "", // 画布宽度
    windowH: "", // 画布高
  },
  bvPL3_180(e) {
    this.setData({
      pl3_180startdate: e.detail.value,
      pl3_180enddate:dateLater(e.detail.value,180).year+'-'+dateLater(e.detail.value,180).newdates
    })
  },
  bvPL3_90(e) {
    this.setData({
      pl3_90startdate: e.detail.value,
      pl3_90enddate:dateLater(e.detail.value,90).year+'-'+dateLater(e.detail.value,90).newdates
    })
  },
  bvPL2_360(e) {
    this.setData({
      pl2_360startdate: e.detail.value,
      pl2_360enddate:dateLater(e.detail.value,360).year+'-'+dateLater(e.detail.value,360).newdates
    })
  },
  bvPL2_180(e) {
    this.setData({
      pl2_180startdate: e.detail.value,
      pl2_180enddate:dateLater(e.detail.value,180).year+'-'+dateLater(e.detail.value,180).newdates
    })
  },
  bvPL2_90(e) {
    this.setData({
      pl2_90startdate: e.detail.value,
      pl2_90enddate:dateLater(e.detail.value,90).year+'-'+dateLater(e.detail.value,90).newdates
    })
  },
  bvPL1_360(e) {
    this.setData({
      pl1_360startdate: e.detail.value,
      pl1_360enddate:dateLater(e.detail.value,360).year+'-'+dateLater(e.detail.value,360).newdates
    })
  },
  bvPL1_180(e) {
    this.setData({
      pl1_180startdate: e.detail.value,
      pl1_180enddate:dateLater(e.detail.value,180).year+'-'+dateLater(e.detail.value,180).newdates
    })
  },
  bvPL1_90(e) {
    this.setData({
      pl1_90startdate: e.detail.value,
      pl1_90enddate:dateLater(e.detail.value,90).year+'-'+dateLater(e.detail.value,90).newdates
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var str = new Date()
    this.setData({
      image: app.globalData.Gimagearray,
      startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
    })

    console.log(this.data.startdate)
    // let that=this
    wx.getSystemInfo({ // 获取设备宽高 canvas设置  由于项目需求背景图不是整屏  我把高减少一部分
      success: res => {
        this.setData({
          windowW: (res.windowWidth - 40),
          windowH: (res.windowWidth - 40) * 1.4
        })
      }
    })
    const db = wx.cloud.database()
    db.collection('DISCOUNTORDER').where({
      _openid: this.data.inviterid,

    }).get({
      success: res => {
        if (res.data.length != 0 && res.data.length != undefined) {
          this.setData({
            plstartdate: res.data[0].PLStartDate,
            plenddate: res.data[0].PLEndDate
          })
          if (res.data[0].PriceLevel == "PL1") {
            this.setData({
              plname: "特惠价"
            })
          } else if (res.data[0].PriceLevel == "PL2") {
            this.setData({
              plname: "巨惠价"
            })
          } else if (res.data[0].PriceLevel == "PL3") {
            this.setData({
              plname: "优惠价"
            })
          } else if (res.data[0].PriceLevel == "PL4") {
            this.setData({
              plname: "普客价"
            })
          }
        } else {
          this.setData({
            plname: "普客价",
          })
        }
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
  onShareAppMessage: function () {

  }
})