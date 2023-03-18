var utils= require("../../utils/utils")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempinviterid:"",
    params:"",
    remark:"积分红包"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    console.log(options)
    this.setData({
      tempinviterid: options.userid,
      params:options,
    })
    await utils._login()
    let data = await utils._usercheck()
    console.log("data", data);
    if (data.length == 0) {
      await utils._newuser(this.data.tempinviterid,this.data.params,this.data.remark)
      await utils._invitercheck()
    } else {
      app.globalData.Guserdata = data[0]
      app.globalData.Gindirectinviterid=data[0].UserInfo.IndirectInviterId
      app.globalData.Ginviterid=data[0].UserInfo.InviterId
      app.globalData.Ginviterphone=data[0].UserInfo.InviterPhone
      console.log("当前用户信息", app.globalData.Guserdata);
      await utils._discountcheck()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})