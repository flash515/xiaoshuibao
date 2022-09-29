const app = getApp()
Page({
  data: {
    key:"one",
    array1: [],
    array2: [],
    array3: [],
    array4: [],
    array5: [],
    productarray: [],
    usertype: "",
    promoterlevel:"",
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.setData({
  key:options.key,
  promoterlevel: app.globalData.Gpromoterlevel,
})

    // 从本地存储中读取产品
    wx.getStorage({
      key: 'LProductList',
      success: res => {
        console.log("打印调用本地产品列表反回结果", res)
        this.setData({
          productarray: res.data
        })
        console.log("产品数组", this.data.productarray)
        // 筛选自然人代开
        var fliter1 = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].Category2 == "记账报税") {
            fliter1.push(this.data.productarray[i]);
          }
        }
        console.log(fliter1);
        // 筛选个体工商
        var fliter2 = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].Category2 == "税种核定") {
            fliter2.push(this.data.productarray[i]);
          }
        }
        console.log(fliter2);
        // 筛选个独/合伙企业
        var fliter3 = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].Category2 == "领票购票") {
            fliter3.push(this.data.productarray[i]);
          }
        }
        console.log(fliter3);
        // 筛选有限公司
        var fliter4 = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].Category2 == "开票代办") {
            fliter4.push(this.data.productarray[i]);
          }
        }
        console.log(fliter4);
                // 筛选开票申请
                var fliter5 = [];
                for (var i = 0; i < this.data.productarray.length; i++) {
                  if (this.data.productarray[i].Category2 == "核定征收") {
                    fliter5.push(this.data.productarray[i]);
                  }
                }
                console.log(fliter5);
        this.setData({
          array1: fliter1,
          array2: fliter2,
          array3: fliter3,
          array4: fliter4,
          array5: fliter5
        })
        // 打印数组
        console.log("记账报税", this.data.array1)
        console.log("税种核定", this.data.array2)
        console.log("领票购票", this.data.array3)
        console.log("开票申请", this.data.array4)
        console.log("有限公司", this.data.array5)
      }

    })
    //括号1结束

  },
  bvProductDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../product/productdetail?' + e.currentTarget.dataset.id
    })
  },
  bvNewOrder(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../order/neworder?' + e.currentTarget.dataset.id
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
    this.setData({
      image: app.globalData.Gimagearray,
      usertype: app.globalData.Gusertype,
      discountlevel: app.globalData.Gdiscountlevel,
      priceshow: app.globalData.Gpriceshow,
      avatarUrl: app.globalData.GavatarUrl,
      nickName: app.globalData.GnickName,
    })
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