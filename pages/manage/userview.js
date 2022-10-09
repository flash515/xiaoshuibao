const app = getApp()
const { startToTrack, startByClick, startByBack } = require("../../utils/track");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userarray: [],
  },
  onLoad: function (options) {
    // 查询本人提交的全部产品

    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "USER",
        command: "or",
        where: [{
          UserType: "client"
        }, {
          UserType: "admin"
        }]
      },
      success: res => {
        console.log("全部用户",  res)
        wx.setStorageSync('LUser', res.result.data);
        //括号1开始
        this.setData({
          userarray: res.result.data,
        })
        console.log("全部用户",this.data.userarray)
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