const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookingarray: [],
  },
  onLoad: function (options) {
    // 查询本人提交的全部商品

    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "BOOKING",
        command: "",
        where: [{BookingStatus:"unchecked"}],
        orderbykey:"AddDate",
        orderby:"desc",
      },
      success: res => {
        //括号1开始
        this.setData({
          bookingarray: res.result.data,
        })
        console.log("待定预约",this.data.bookingarray)
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