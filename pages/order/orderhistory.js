// pages/order/orderhistory.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderhistory: [],
    // 轮播参数
    image: [{
        url: '../../img/toutu.jpg'
      },
      {
        url: '../../img/1.jpg'
      },
      {
        url: '../../img/2.jpg'
      },
      {
        url: '../../img/3.jpg'
      },
      {
        url: '../../img/4.jpg'
      },
      {
        url: '../../img/5.jpg'
      },
      {
        url: '../../img/6.jpg'
      },
      {
        url: '../../img/7.jpg'
      }
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },
  // 转到订单详情
  bvOrdertDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../order/orderdetail?_id=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({image:app.globalData.Gimagearray})
    wx.cloud.callFunction({
      name: 'OrderHistoryQuery',
      data: {
        userid: app.globalData.Gopenid,
      },
      success: res => {
        console.log("云函数查询", res.result.data)
        wx.setStorageSync('LOrderHistory', res.result.data);
        this.setData({
          // 列表渲染
          orderhistory: res.result.data
        })
      },
      complete: res => {
        console.log("云函数查询完成")
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