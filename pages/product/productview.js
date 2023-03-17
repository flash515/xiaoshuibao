const app = getApp()
var {
  _productcheck,
  _login,
  _setting,
  _usercheck,
  _newuser,
  _olduser,
  _invitercheck
} = require("../../utils/initialize")
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
Page({
  data: {
    params:"",
    paramname:"",
    paramvalue:"",
    currentTab:0,
    index: 0,
    category2name: "",
    sortarray: [],
    productarray: [],
    usertype: "",
    promoterlevel: "",
    discountlevel: "",
    priceshow: "",
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
    console.log(app.globalData.Gproduct)
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
  onLoad: async function (options) {
    this.setData({
      params:options
    })
    console.log(options)
    var that = this
    if (app.globalData.Gproduct == undefined) {

      // 调用初始化
      await _setting()
      await _productcheck()
      console.log("这一步执行了")
      await _login()
      let data = await _usercheck()
      console.log("data", data);
      if (data.length == 0) {
        await _newuser()
      } else {
        app.globalData.Guserdata.UserInfo = data[0].UserInfo
        app.globalData.Guserdata.TradeInfo = data[0].TradeInfo
        console.log("当前用户信息", app.globalData.Guserdata.UserInfo);
        console.log("当前用户交易信息", app.globalData.Guserdata.TradeInfo);
        await _olduser()
      }
      await _invitercheck()
      console.log("这一步执行了")
    if (options.category2 != undefined && options.category2 != "") {
      for (let i = 0; i < app.globalData.Gsetting.SortArray.length; i++) {
        for (var j = 0; j < app.globalData.Gsetting.SortArray[i].Category2Array.length; j++) {
          if (app.globalData.Gsetting.SortArray[i].Category2Array[j].Category2Name == options.category2) {
            var tempsort = app.globalData.Gsetting.SortArray[i].Category2Array[j].Category3Array
          }
        }
      }
      this.setData({
        sortarray: tempsort,
        paramname:"category2",
        paramvalue:options.category2
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
        sortarray: tempsort,
        paramname:"category3",
        paramvalue:options.category3
      })
      var category = options.category3
      this._setproductarray(category)
    }
    console.log(this.data.sortarray)
    this.setData({
      image: app.globalData.Gimagearray,
      usertype: app.globalData.Guserdata.UserInfo.UserType,
      discountlevel: app.globalData.Guserdata.TradeInfo.DiscountLevel,
      priceshow: app.globalData.Gpriceshow,
      userphone:app.globalData.Guserdata.UserInfo.UserPhone,
    })

      }
      else{
        console.log("这一步执行了")
        if (options.category2 != undefined && options.category2 != "") {
          for (let i = 0; i < app.globalData.Gsetting.SortArray.length; i++) {
            for (var j = 0; j < app.globalData.Gsetting.SortArray[i].Category2Array.length; j++) {
              if (app.globalData.Gsetting.SortArray[i].Category2Array[j].Category2Name == options.category2) {
                var tempsort = app.globalData.Gsetting.SortArray[i].Category2Array[j].Category3Array
              }
            }
          }
          this.setData({
            sortarray: tempsort,
            paramname:"category2",
            paramvalue:options.category2
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
            sortarray: tempsort,
            paramname:"category3",
            paramvalue:options.category3
          })
          var category = options.category3
          this._setproductarray(category)
        }
        console.log(this.data.sortarray)
        this.setData({
          image: app.globalData.Gimagearray,
          usertype: app.globalData.Guserdata.UserInfo.UserType,
          discountlevel: app.globalData.Guserdata.TradeInfo.DiscountLevel,
          priceshow: app.globalData.Gpriceshow,
          userphone:app.globalData.Guserdata.UserInfo.UserPhone,
        })

      } 


  },

  bvProductDetail(e) {
    console.log("准备传递的页面参数",e.currentTarget.dataset.params)
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
console.log("显示执行时间")
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.Guserdata.UserInfo.nickName + '推荐给您：',
      path: '/pages/product/productview?userid=' + app.globalData.Guserid + '&'+this.data.paramname+"="+this.data.paramvalue,
      imageUrl: '', //封面，留空自动抓取500*400生成图片
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(this.data.path.value)
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
  },

})