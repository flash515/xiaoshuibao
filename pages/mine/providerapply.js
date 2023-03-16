// pages/mine/providerapply.js

const util = require('../../utils/initialize')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

    // 预览文件
    previewFile(fileLink) {
      
      if(!fileLink) {
          return false
      }
      util.showLoading()
    
      // 单次下载允许的最大文件为 200MB
      wx.downloadFile({
          url: "https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/%E6%9C%8D%E5%8A%A1%E5%95%86%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE20230315.pdf?sign=db764e5993fec167cbb57635ba08b104&t=1678967468", // 地址已打码，自己换个其他的地址("https://www.xxxxx.com/file/测试通知.pdf")
          success: function (res) {
              console.log(res, "wx.downloadFile success res")
              if(res.statusCode != 200) {
                  util.hideLoadingWithErrorTips()
                  return false
              }
              var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
              wx.openDocument({
                  filePath: Path,
                  showMenu: true,
                  success: function (res) {
                      console.log('打开成功');
                      util.hideLoading()
                  }
              })
          },
          fail: function (err) {
              console.log(err, "wx.downloadFile fail err");
              util.hideLoadingWithErrorTips()
          }
      })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})