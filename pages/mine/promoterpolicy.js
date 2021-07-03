const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startdate: "",
    startdate1: "",
    startdate2: "",
    startdate3: "",
    plstartdate: "",
    promoterlevel: "",
    promotername: "",
    totalfee: "",
    applylock: false,
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
  bvStartDate1(e) {
    this.setData({
      startdate1: e.detail.value,
    })
  },
  bvStartDate2(e) {
    this.setData({
      startdate2: e.detail.value,
    })
  },
  bvStartDate3(e) {
    this.setData({
      startdate3: e.detail.value,
    })
  },
  bvApply(e) {
    let that = this
    this.setData({
      promoterlevel: e.currentTarget.dataset.level,
      promotername: e.currentTarget.dataset.name,
      plstartdate: e.currentTarget.dataset.startdate,
      totalfee: e.currentTarget.dataset.price,
    })
    if (this.data.applylock) {
      wx.showToast({
        title: '请勿重复提交',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    } else {
      if (this.data.plstartdate == "" || this.data.plstartdate == undefined) {
        wx.showToast({
          title: '请选择生效日期',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      } else {
        const db = wx.cloud.database()
        // 新增数据
        db.collection("PROMOTERORDER").add({
          data: {
            PromoterLevel: this.data.promoterlevel,
            PromoterName: this.data.promotername,
            PLStartDate: this.data.plstartdate,
            TotalFee: this.data.totalfee,
            PaymentStatus: "unchecked",
            AddDate: new Date().toLocaleDateString(),
            PaymentStatus:"unchecked",
            ApplyStatus:"unchecked",
          },
          success(res) {
            that.setData({
              applylock: true
            })
            wx.showToast({
              title: '申请提交成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })
            wx.navigateTo({
              url: '../order/pay?totalfee=' + that.data.totalfee
            })
          },
          fail(res) {
            wx.showToast({
              title: '申请提交失败',
              icon: 'error',
              duration: 2000 //持续的时间
            })
          }
        })
      }
    }
  },
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
      // {
      //   PLStartDate: _.lte(new Date())
      // },
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
            promotername: "普客",
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