const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    plstartdate: "",
    promoterlevel:"",
    promotername:"",
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
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
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PROMOTERORDER').where(_.and([{
        _openid: app.globalData.Gopenid,
      },
      {
        DStartDate: _.lte(new Date())
      },
      {
        DEndDate: _.gte(new Date())
      }
    ])).get({
      success: res => {
        console.log(res)
        if (res.data.length != 0 && res.data.length != undefined) {
          this.setData({
            plstartdate: res.data[0].PLStartDate,
            promoterlevel: res.data[0].PromoterLevel,
          })
          if (res.data[0].PromoterLevel == "sliver") {
            this.setData({
              promotername: "白银推广大使"
            })
          } else if (res.data[0].PromoterLevel == "gold") {
            this.setData({
              promotername: "黄金推广大使"
            })
          } else if (res.data[0].PromoterLevel == "platinum") {
            this.setData({
              promotername: "铂金推广大使"
            })
          } else if (res.data[0].PromoterLevel == "normal") {
            this.setData({
              promotername: "普客"
            })
          }
        } else {
          this.setData({
            promotername: "普客价",
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