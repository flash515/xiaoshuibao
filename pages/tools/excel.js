// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileid: ""
  },
  choosefile() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: res => {
        let path = res.tempFiles[0].path;
        console.log("excel文件选择成功", path)
        that.uploadExcel(path)
      }
    })
  },

  uploadExcel(path) {
    let that = this
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime() + '.xls',
      filePath: path,
      success: res => {
        console.log("上传成功", res.fileID)
        this.setData({
          fileid: res.fileID
        })
      }
    })

  },

  jiexi(fileid) {
    wx.cloud.callFunction({
      name: "ClientExcel",
      data: {
        fileID: this.data.fileid
      },
      success(res) {
        console.log("导入成功", res)
      },
      fail(res) {
        console.log("导入失败", res)
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