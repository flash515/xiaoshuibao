// pages/mine/regist.js
var app = getApp()
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
    // 用户信息
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
    //新增数据变量
    companyname: "",
    companyid: "",
    businessscope: "",
    companyscale: "",
    username: "",
    userphone: "",
    sublock: false
  },
  // 新增事件变量赋值
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
  bvBusiness(e) {
    this.setData({
      business: e.detail.value
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
      userphone: Number(e.detail.value)
    })
  },
  // 异步新增数据方法
  addData() {
    // 判断是否重复提交
    if (this.data.sublock) {
      // 锁定时很执行
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      // 未锁定时执行
      // 获取数据库引用
      const db = wx.cloud.database()
      // 新增数据
      db.collection("USER").add({
          data: {
            CompanyName: this.data.companyname,
            CompanyId: this.data.companyid,
            Business: this.data.business,
            CompanyScale: this.data.companyscale,
            UserName: this.data.username,
            UserPhone: this.data.userphone,
            wxUserInfo: this.data.userInfo,
            // AddDate: JSON.stringify(new Date()),
            // 以时间戳记录生成时间
            SysAddDate: new Date().getTime(),
            AddDate:new Date().toLocaleDateString()
          },
          success(res) {
            console.log('新增数据成功', res.data)
            wx.showToast({
              title: '新增数据成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })
          },
          fail(res) {
            console.log("新增数据失败", res)
            wx.showToast({
              title: '新增数据失败',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        }),
        // 以上新增数据结束
        this.data.sublock = true // 修改上传状态为锁定
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({image:app.globalData.Gimagearray})
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        app.globalData.GuserInfo = res.userInfo
        console.log(app.globalData.GuserInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    })
  },
  // getUserInfo(e) {
  //   // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }


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