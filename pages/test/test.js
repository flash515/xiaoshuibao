// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  chooseExcel() {
    let that = this
    wx.chooseMessageFile({
      count: 1,
      type: "file",
      success(res) {
        let path = res.tempFiles[0].path;
        console.log("选择excel成功", path)
        that.uploadExcel(path);
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
        that.bvDaoRu(res.fileID)
      },
      fail: err => {
        console.log("上传失败", err)
      }
    })
  },

  bvDaoRu(fileid) {
    wx.cloud.callFunction({
      name: "excel",
      data: {
        fileID: "cloud://xsbmain-9gvsp7vo651fd1a9.7873-xsbmain-9gvsp7vo651fd1a9-1304477809/namecard/zhizao5000.xls"
      },
      success(res) {
        console.log("导入成功", res)
      },
      fail(res) {
        console.log("导入失败", res)
      }
    })
  },

  clearNameCard() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'MeetingRoomClean',
      data: {
        collection: "NAMECARD"
      },
      success: res => {
        console.log("已清空")
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