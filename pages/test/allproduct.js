const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
Page({
  data: {
    windowH: "",
    url: "",
    sortarray: [],
    array: [],
    array2: [],
    array3: [],
    array4: [],
    array5: [],
    promoterlevel: "",
    productarray: [],
    usertype: "",
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
  bvSortChange(e) {
    console.log(e.currentTarget.dataset.name)
    for (let i = 0; i < this.data.sortarray.length; i++) {
      if (this.data.sortarray[i].Category1Name == e.currentTarget.dataset.name) {
        this.setData({
          array: this.data.sortarray[i].Category2Array
        })

      }
    }
    console.log(this.data.array)
  },
  bvTagClick(e){
    console.log(e.currentTarget.dataset.name)
    console.log(e.currentTarget.dataset.sort)
    wx.navigateTo({
      url: "../test/productview?"+"category3=" + e.currentTarget.dataset.name+"&sort="+e.currentTarget.dataset.sort
    })
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
      windowH: (app.globalData.GHeight - 100) * 750 / app.globalData.GWidth
    })

    //括号1结束
    //获取小程序全局设置
    let that = this
    const db = wx.cloud.database()
    db.collection('setting')
      .where({
        currentstatus: "effect"
      })
      .get({
        success: res => {
          app.globalData.Gsortarray = res.data[0].SortArray;
          that.setData({
            sortarray: res.data[0].SortArray
          })
          console.log(that.data.sortarray)
        }
      })

  },
  bvProductDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../product/productdetail?productid=' + e.currentTarget.dataset.id
    })
  },
  bvNewOrder(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../order/neworder?productid=' + e.currentTarget.dataset.id
    })
  },

  changeTabs(e) {
    console.log(e.detail.activeKey)
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
      promoterlevel: app.globalData.Gpromoterlevel,
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
  onShareAppMessage(res) {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const url = `/${currentPage.route}`
    console.log(url)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.GnickName + '邀请您体验：',
      path: '/pages/index/index?userid=147' + "&page=" + url,
      imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/sharepic.png?sign=550a147f349dddb2a06196826020450d&t=1659681079', //封面
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

  onShareTimeline: function () {

  }
})