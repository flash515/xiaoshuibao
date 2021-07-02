const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklock:false,
    address:"",
    phone:"",
    contacts:"",
    data:"",
    time:"",
    tatalfee: 0,
    // 轮播头图
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
    // 保存到手机
    saveImage: function (event) {
      wx.saveImageToPhotosAlbum({
        filePath: event.currentTarget.dataset.src,
        success(result) {
          wx.showToast({
            title: '推广码保存成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
  //图片点击事件
  enlarge: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = [
      'cloud://xsbmain-9gvsp7vo651fd1a9.7873-xsbmain-9gvsp7vo651fd1a9-1304477809/omLS75Xib_obyxkVAahnBffPytcA/微信收款码.png',
      'cloud://xsbmain-9gvsp7vo651fd1a9.7873-xsbmain-9gvsp7vo651fd1a9-1304477809/omLS75Xib_obyxkVAahnBffPytcA/支付宝收款码.jpg'
    ]
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  bvTime(e){
    this.setData({
      time: e.detail.value,
    })
  },
  bvDate(e){
    this.setData({
      date: e.detail.value,
    })
  },
  bvContacts(e){
    this.setData({
      contacts: e.detail.value,
    })
  },
  bvPhone(e){
    this.setData({
      phone: e.detail.value,
    })
  },
  bvAddress(e){
    this.setData({
      address: e.detail.value,
    })
  },
  bvBook(){
          // 判断是否重复提交
          if (this.data.booklock) {
            // 锁定时很执行
            wx.showToast({
              title: '请勿重复提交',
              icon: 'error',
              duration: 2000 //持续的时间
            })
          } else {
            // 未锁定时执行
            // 获取数据库引用
            const db = wx.cloud.database()
            db.collection('BOOKING').add({
                data: {
                  Address: this.data.address,
                  Phone: this.data.phone,
                  Contacts: this.data.contacts,
                  BookingDate:this.data.date,
                  BookingTime:this.data.time,
                  BookingContent: "上门取款服务",
                  BookingStatus:"unchecked",
                  AddDate: new Date().toLocaleDateString()
                },
                success(res) {
                  console.log('预约提交成功', res.data)
                  wx.showToast({
                    title: '预约提交成功',
                    icon: 'success',
                    duration: 2000 //持续的时间
                  })
                },
                fail(res) {
                  console.log("提交失败", res)
                  wx.showToast({
                    title: '预约提交失败',
                    icon: 'error',
                    duration: 2000 //持续的时间
                  })
                }
              }),
              this.data.booklock = true // 修改上传状态为锁定
          }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var str = new Date()
    this.setData({
      totalfee: options.totalfee,
      image:app.globalData.Gimagearray,
      startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
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