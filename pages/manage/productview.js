const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productarray: [],
    dkarray: [],
    gtarray: [],
    gdarray: [],
    GSarray: []
  },
  bvAddProduct(e) {
    wx.navigateTo({
      url: '../manage/productedit'
    })
  },
  bvEditProduct(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../manage/productedit?' + e.currentTarget.dataset.id
    })
  },
    //复制下载链接
    bvCopyDownLink(e) {
      var url = e.currentTarget.dataset.link; //获取data-link中的值
      // var url=this.data.url;
      wx.setClipboardData({
        data: url,
        success: function (res) {
          // self.setData({copyTip:true}),
          wx.hideToast();
          wx.showModal({
            title: '提示',
            content: '该文件下载链接已复制到剪贴板，请打开手机浏览器，在手机浏览器地址栏中粘贴下载链接并下载、保存文件',
            success: function (res) {
              if (res.confirm) {
                console.log('确定')
              } else if (res.cancel) {
                console.log('取消')
              }
            }
          })
  
        }
      })
    },
  onLoad: function (options) {
    // 查询本人提交的全部产品
    const db = wx.cloud.database()
    db.collection('PRODUCT').where({
      _openid:app.globalData.Gopenid
    }).get({
      success: res => {
        wx.setStorageSync('LPersonalProduct', res.data);
        //括号1开始
        this.setData({
          productarray: res.data,
        })
        console.log("本人产品数组", this.data.productarray)
        // 筛选自然人代开
        var DKfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "自然人代开") {
            DKfliter.push(this.data.productarray[i]);
          }
        }

        // 筛选个体工商
        var GTfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "个体工商") {
            GTfliter.push(this.data.productarray[i]);
          }
        }

        // 筛选个独/合伙企业
        var GDfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "个独/合伙企业") {
            GDfliter.push(this.data.productarray[i]);
          }
        }

        // 筛选有限公司
        var GSfliter = [];
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i].ProductType == "有限公司") {
            GSfliter.push(this.data.productarray[i]);
          }
        }

        this.setData({
          DKarray: DKfliter,
          GTarray: GTfliter,
          GDarray: GDfliter,
          GSarray: GSfliter
        })
        // 打印数组
        console.log("代开产品", this.data.DKarray)
        console.log("个体产品", this.data.GTarray)
        console.log("个独/合伙", this.data.GDarray)
        console.log("有限公司", this.data.GSarray)
      },
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