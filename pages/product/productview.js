const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
Page({
  data: {
    category2name: "",
    category3name: "",
    sort: [],
    productarray: [],
    array: [],
    usertype: "",
    promoterlevel: "",
    discountlevel: "",
    priceshow: "",
    avatarUrl: "",
    nickName: "",
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
        app.globalData.GavatarUrl = res.userInfo.avatarUrl
        app.globalData.GnickName = res.userInfo.nickName
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
    this.data.categoryname = e.currentTarget.dataset.name
    var category = e.currentTarget.dataset.name
    this._setarray(category)
  },
  _setarray(category) {
    console.log(category)
    var fliter = []
    for (let i = 0; i < this.data.productarray.length; i++) {
      if (this.data.productarray[i].Category3 == category) {
        fliter.push(this.data.productarray[i])
      }
    }
    this.setData({
      array: fliter
    })
    console.log(this.data.array)

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    if (options.category2 != undefined && options.category2 != "") {
      this.setData({
        category2name: options.category2,
      })
      wx.cloud.callFunction({
        name: "NormalQuery",
        data: {
          collectionName: "PRODUCT",
          command: "or",
          where: [{
            Status: "在售"
          }]
        },
        success: res => {
          console.log(res)
          app.globalData.Gproductarray = res.result.data
          var fliter = []
          for (let i = 0; i < app.globalData.Gproductarray.length; i++) {
            if (app.globalData.Gproductarray[i].Category2 == this.data.category2name) {
              fliter.push(app.globalData.Gproductarray[i]);
            }
          }
          that.setData({
            productarray: fliter.sort(function (a, b) {
              if (a.Category3 < b.Category3) {
                return -1
              }
              if (a.Category3 > b.Category3) {
                return 1
              }
              if (a.Category3 = b.Category3) {
                return 0
              }
            })
          })
          console.log(that.data.productarray)
          var category = this.data.productarray[0].Category3
          this._setarray(category)
        }
      })

    }
    if (options.category3 != undefined && options.category3 != "") {
      this.setData({
        category3name: options.category3,
      })
      wx.cloud.callFunction({
        name: "NormalQuery",
        data: {
          collectionName: "PRODUCT",
          command: "or",
          where: [{
            Status: "在售"
          }]
        },
        success: res => {
          console.log(res)
          app.globalData.Gproductarray = res.result.data
          var fliter = []
          for (let i = 0; i < app.globalData.Gproductarray.length; i++) {
            if (app.globalData.Gproductarray[i].Category3 == that.data.category3name) {
              fliter.push(app.globalData.Gproductarray[i]);
            }
          }
          that.setData({
            productarray: fliter
          })
          console.log(that.data.productarray)
          var category = this.data.productarray[0].Category3
          this._setarray(category)
        }
      })

    }


    //括号1结束
  },
 
  bvProductDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: "../product/productdetail?" + "productid=" + e.currentTarget.dataset.id
    })
    startByClick(e.currentTarget.dataset.name);
  },
  bvNewOrder(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: "../order/neworder?" + "productid=" + e.currentTarget.dataset.id
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
      usertype: app.globalData.Gusertype,
      discountlevel: app.globalData.Gdiscountlevel,
      priceshow: app.globalData.Gpriceshow,
      avatarUrl: app.globalData.GavatarUrl,
      nickName: app.globalData.GnickName,
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