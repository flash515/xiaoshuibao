const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播参数
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    individualarray: [],
    enterprisearray: []
  },
  editIndividual(e) {
    console.log(e.currentTarget.dataset.editid)
    wx.navigateTo({
      url: '../order/individual?' + e.currentTarget.dataset.editid
    })
  },
  editEnterprise(e) {
    console.log(e.currentTarget.dataset.editid)
    wx.navigateTo({
      url: '../order/enterprise?' + e.currentTarget.dataset.editid
    })
  },
  editAddress(e) {
    console.log(e.currentTarget.dataset.editid)
    wx.navigateTo({
      url: '../order/address?' + e.currentTarget.dataset.editid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({image:app.globalData.Gimagearray})
    const db = wx.cloud.database()
    // 查询当前用户所有的INDIVIDUAL
    db.collection('INDIVIDUAL').where({
        _openid: this.data.openid,
      }).get({
        success: res => {
          console.log(res);
          //  INDIVIDUAL存入本地
          wx.setStorageSync('LIndividual', res.data);
          this.setData({
            // 列表渲染
            individualarray: res.data
          })
        }
      }),
      // 查询当前用户所有的ENTERPRISE
      db.collection('ENTERPRISE').where({
        _openid: this.data.openid,
      }).get({
        success: res => {
          console.log(res);
          //  INDIVIDUAL存入本地
          wx.setStorageSync('LEnterprise', res.data);
          this.setData({
            // 列表渲染
            enterprisearray: res.data
          })
        }
      })
    // 查询当前用户所有的ADDRESS
    db.collection('ADDRESS').where({
      _openid: this.data.openid,
    }).get({
      success: res => {
        console.log(res);
        //  INDIVIDUAL存入本地
        wx.setStorageSync('LAddress', res.data);
        this.setData({
          // 列表渲染
          addressarray: res.data
        })
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