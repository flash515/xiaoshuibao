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
    invitercompanyname: "",
    inviterusername: "",
    companyname: "",
    companyid: "",
    businessscope: "",
    companyscale: "",
    username: "",
    userphone: "",
    usertype: "",
    adddate: "",
    updatedate: ""
  },
  bvCompanyName(e) {
    this.setData({
      companyname: e.detail.value
    })
  },
  bvCompanyId(e) {
    this.setData({
      companyid: e.detail.value
    })
  },
  bvBusinessScope(e) {
    this.setData({
      businessscope: e.detail.value
    })
  },
  bvCompanyScale(e) {
    this.setData({
      companyscale: e.detail.value
    })
  },
  bvUserName(e) {
    this.setData({
      username: e.detail.value
    })
  },
  bvUserPhone(e) {
        this.setData({
          userphone: e.detail.value
        })
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({image:app.globalData.Gimagearray})
    // 从本地存储中读取
    wx.getStorage({
      key: 'LInviterUser',
      success: res => {
        this.setData({
          invitercompanyname: res.data[0].CompanyName,
          inviterusername: res.data[0].UserName,
        })
      }
    })
    wx.getStorage({
      key: 'LUserInfo',
      success: res => {
        this.setData({
          companyname: res.data[0].CompanyName,
          companyid: res.data[0].CompanyId,
          businessscope: res.data[0].BusinessScope,
          companyscale: res.data[0].CompanyScale,
          username: res.data[0].UserName,
          userphone: res.data[0].UserPhone,
          usertype: res.data[0].UserType,
          adddate: res.data[0].AddDate,
          updatedate: res.data[0].UpdateDate
        })
      }
    })
  },
  // 更新信息
  //修改数据操作
  UpdateData() {
    console.log('调用修改更新数据的方法')
    const db = wx.cloud.database()
    db.collection('USER').where({
      _openid: this.data.openid
    }).update({
      data: {
        CompanyName: this.data.companyname,
        CompanyId: this.data.companyid,
        CompanyScale: this.data.companyscale,
        BusinessScope: this.data.businessscope,
        UserName: this.data.username,
        UserPhone: this.data.userphone,
        UpdateDate: new Date().toLocaleDateString()
      },
      success(res) {
        wx.showToast({
          title: '更新信息成功',
          icon: 'success',
          duration: 2000 //持续的时间
        })
      },
      fail(res) {
        wx.showToast({
          title: '更新信息失败',
          icon: 'error',
          duration: 2000 //持续的时间
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