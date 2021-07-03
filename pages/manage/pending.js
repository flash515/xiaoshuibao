// pages/manage/pending.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dkorderuncheckarray:[],
    zcorderuncheckarray:[],
    delegateissuearray:[],
    promoteruncheckarray:[],
    discountuncheckarray:[],
    bookingarray:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection("DKORDER").where(_.or([
      {
        PaymentStatus:"unchecked",
      },
      {
        OrderStatus:"unchecked",
      }
    ])).get({
      success: res => {
        this.setData({
          dkorderuncheckarray: res.data
        })
      },
    })
    db.collection("ZCORDER").where(_.or([
      {
        PaymentStatus:"unchecked",
      },
      {
        OrderStatus:"unchecked",
      }
    ])).get({
      success: res => {
        this.setData({
          zcorderuncheckarray: res.data
        })
      },
    })
    db.collection("DELEGATEISSUE").where(_.or([
      {
        PaymentStatus:"unchecked",
      },
      {
        OrderStatus:"unchecked",
      }
    ])).get({
      success: res => {
        this.setData({
          delegateissuearray: res.data
        })
      },
    })
    db.collection("PROMOTERORDER").where(_.or([
      {
        PaymentStatus:"unchecked",
      },
      {
        ApplyStatus:"unchecked",
      }
    ])).get({
      success: res => {
        this.setData({
          promoteruncheckarray: res.data
        })
      },
    })
    db.collection("DISCOUNTORDER").where(_.or([
      {
        PaymentStatus:"unchecked",
      },
      {
        OrderStatus:"unchecked",
      }
    ])).get({
      success: res => {
        this.setData({
          discountuncheckarray: res.data
        })
      },
    })
    db.collection("BOOKING").where({
        BookingStatus:"unchecked",
    }).get({
      success: res => {
        this.setData({
          bookingarray: res.data
        })
      },
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