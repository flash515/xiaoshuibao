const app = getApp();
const utils = require("../../utils/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userphone: "",
    // 显示在 Tip 区域的文字
    indexText: "",
    allcards: [],
    namecard: [],
    // 轮播头图
    image: [],
  },
  onSearch(e) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PRODUCT').where(_.and([{
        UserId: app.globalData.Guserid
      },
      _.or([{
          IssuedBy: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },
        {
          ProductType: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },
        {
          Status: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        }
      ])
    ])).get({
      success: res => {
        this.setData({
          productarray: res.data,
        })
        if (res.data.length > 1) {
          this.setData({
            recordcontral: true
          })
        }
        this.setcurrentdata()
      }
    })
  },
  // 页面监听函数
  onPageScroll(res) {

  },
  bvNameCardSelect(e) {
    // 设定名片背景
    this.setData({
      namecard: e.detail.cell
    })
    console.log("cardbg", e.detail.key)
  },
  // 长按号码响应函数
  bvPhoneNumTap: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.cardinfo.handphone,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      image: app.globalData.Gimagearray,
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,
    })
    let allcards = await utils._NameCardCheck()
    this.setData({
      allcards: allcards
    })
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