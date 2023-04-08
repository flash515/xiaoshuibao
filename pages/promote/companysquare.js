const app = getApp();
const track = require("../../utils/track");
const utils = require("../../utils/utils");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userphone: "",
    // 显示在 Tip 区域的文字
    indexText: "",

    // 轮播头图
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


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      image: app.globalData.Gimagearray,
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,
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