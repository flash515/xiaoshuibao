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
      url: "../test/productview?"+"category3=" + e.currentTarget.dataset.name
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      windowH: (app.globalData.GHeight - 100) * 750 / app.globalData.GWidth
    })

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

})