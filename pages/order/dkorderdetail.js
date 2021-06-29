const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    orderarray: [],
    orderdetail: [],
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 提取参数
    this.setData({
      pageParam: options,
      image:app.globalData.Gimagearray
    })
    // 从本地存储中读取
    wx.getStorage({
      key: 'LDKOrderHistory',
      success: res => {
        this.setData({
          orderarray: res.data
        })
        console.log("订单列表", this.data.orderarray) //Object {errMsg: "getStorage:ok", data: "value1"}
        // 筛选指定记录
        var fliter = [];
        // var _this = this
        for (var i = 0; i < this.data.orderarray.length; i++) {
          if (this.data.orderarray[i]._id == this.data.pageParam._id) {
            fliter.push(this.data.orderarray[i]);
          }
        }
        console.log(fliter);
        this.setData({
          orderdetail: fliter
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