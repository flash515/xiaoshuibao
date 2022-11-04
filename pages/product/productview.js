const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
Page({
  data: {
    currentTab:0,
    index: 0,
    category2name: "",
    category3name: "",
    sortarray: [],
    productarray: [],
    usertype: "",
    promoterlevel: "",
    discountlevel: "",
    priceshow: "",
    avatarUrl: "",
    nickName: "",
    userphone:"",
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

  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: "登录小税宝以查看更多信息",
      success: res => {
        console.log("获得的用户微信信息", res)
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
        app.globalData.Guserinfo = res.userInfo.
        app.globalData.Guserinfo.nickName = res.userInfo.nickName
        // 获取数据库引用
        const db = wx.cloud.database()
        // 更新数据
        db.collection('USER').where({
          _openid: app.globalData.Gopenid
        }).update({
          data: {
            avatarUrl: res.userInfo.avatarUrl,
            city: res.userInfo.city,
            country: res.userInfo.country,
            gender: res.userInfo.gender,
            language: res.userInfo.language,
            nickName: res.userInfo.nickName,
            province: res.userInfo.province
          },
        })
        // 以上更新数据结束
        wx.showToast({
          icon: 'success',
          title: '登录成功',
        })
        return;
      },
      fail: res => {
        //拒绝授权
        wx.showToast({
          icon: 'error',
          title: '您拒绝了请求',
        })
        return;
      }
    })
  },
  bvSortChange(e) {
    console.log(e.currentTarget.dataset.name)
    console.log(e.currentTarget.dataset.index)
    this.setData({
      currentTab: e.currentTarget.dataset.index,   //按钮CSS变化
    })
    this.data.categoryname = e.currentTarget.dataset.name
    var category = e.currentTarget.dataset.name
    this._setproductarray(category)
  },
  _setproductarray(category) {
    console.log(category)
    var fliter = []
    for (let i = 0; i < app.globalData.Gproduct.length; i++) {
      if (app.globalData.Gproduct[i].Category3 == category) {
        fliter.push(app.globalData.Gproduct[i])
      }
    }
    this.setData({
      productarray: fliter
    })
    console.log(this.data.productarray)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    if (options.category2 != undefined && options.category2 != "") {
      for (let i = 0; i < app.globalData.Gsortarray.length; i++) {
        for (let j = 0; j < app.globalData.Gsortarray[i].Category2Array.length; j++) {
          if (app.globalData.Gsortarray[i].Category2Array[j].Category2Name == options.category2) {
            var tempsort = app.globalData.Gsortarray[i].Category2Array[j].Category3Array
          }
        }
      }
      this.setData({
        sortarray: tempsort
      })
      console.log(this.data.sortarray)
      // SortArray是静态数组，不需要重新排序，直接以下标就可以确定首位key
      var category = tempsort[0].Category3Name
      this._setproductarray(category)
    }
    if (options.category3 != undefined && options.category3 != "") {
      // 把单个三级分类名称构建成数组形式以便于前端页面按统一的方法渲染
      var tempsort = []
      var obj = new Object();
      obj = {
        "Category3Name": options.category3
      }
      tempsort.push(obj)
      this.setData({
        sortarray: tempsort
      })
      var category = options.category3
      this._setproductarray(category)
    }
    console.log(this.data.sortarray)
  },

  bvProductDetail(e) {
    console.log(e.currentTarget.dataset.params)
    wx.navigateTo({
      url: "../product/productdetail?"+ e.currentTarget.dataset.params    })
    startByClick(e.currentTarget.dataset.name);
  },
  bvNewOrder(e) {
    console.log(e.currentTarget.dataset.params);
    wx.navigateTo({
      url: "../order/neworder?" + e.currentTarget.dataset.params
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
    this.setData({
      image: app.globalData.Gimagearray,
      usertype: app.globalData.Guserinfo.UserType,
      discountlevel: app.globalData.Guserinfo.DiscountLevel,
      priceshow: app.globalData.Gpriceshow,
      avatarUrl: app.globalData.Guserinfo.avatarUrl,
      nickName: app.globalData.Guserinfo.nickName,
      userphone:app.globalData.Guserinfo.UserPhone,
    })
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