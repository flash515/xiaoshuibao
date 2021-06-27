

Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowW:'', // 设备宽
    windowH:'', // 设备高
    headPath:'cloud://xsbmain-9gvsp7vo651fd1a9.7873-xsbmain-9gvsp7vo651fd1a9-1304477809/omLS75Xib_obyxkVAahnBffPytcA/有缘.jpg',// 头像地址
    cardPath:'cloud://xsbmain-9gvsp7vo651fd1a9.7873-xsbmain-9gvsp7vo651fd1a9-1304477809/omLS75Xib_obyxkVAahnBffPytcA/index.png',// 背景图地址
    ewmPath:'cloud://xsbmain-9gvsp7vo651fd1a9.7873-xsbmain-9gvsp7vo651fd1a9-1304477809/omLS75Xib_obyxkVAahnBffPytcA/小税宝带参数.png', // 二维码地址
    sendName: '小税宝',// 用户名
    show:false,

  },
show(){
  this.setData({
    show:true
  })
},
noshow(){
  this.setData({
    show:false
  })
},
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    // var that = this;
    wx.getSystemInfo({ // 获取设备宽高 canvas设置  由于项目需求背景图不是整屏  我把高减少一部分
      success: (res) => {
        this.setData({
          windowW: res.windowWidth,
          windowH: res.windowHeight-80
        })
      },
    })
    // wx.request({ // 请求资源，绘制的图片地址
    //   url: '',
    //   method: "GET",
    //   data: {
    //     "token": ""//我这里只需要token值，可以根据需要的参数传
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) { 
    //     that.setData({ // 根据返回值设置data中的值
    //       headPath: res.data.data.avatar,
    //       cardPath: res.data.data.back_url,
    //       ewmPath: res.data.data.url,
    //       sendName:res.data.data.nickname
    //     })
    //     that.drawCanvas();
    //   }
    // })
  },
  drawCanvas: function () {
    // var that = this;
    var bgWidth = this.data.windowW-40
    let ctx = wx.createCanvasContext('myCanvas');
    wx.getImageInfo({
      src: this.data.cardPath,
      success: (res) => {
        console.log("res1",res)
        //绘制背景图不是铺满屏幕也减少一部分 x坐标 y坐标 宽度 高度
        ctx.drawImage(res.path, 20, 0, bgWidth, this.data.windowH); 
        wx.getImageInfo({
          src:this.data.headPath,
          success: (res) => {
            console.log("res2",res)
            ctx.drawImage(res.path, this.data.windowW/3, this.data.windowH/4.6, this.data.windowW/6.8, this.data.windowH/9); // 头像
        wx.getImageInfo({
          src: this.data.ewmPath,
          success: (res) => {
            console.log("res3",res)
            ctx.drawImage(res.path, this.data.windowW/2.7, this.data.windowH/1.7, this.data.windowW/4,this.data.windowH/5); //二维码
            ctx.setTextAlign('left');
            ctx.setTextBaseline('middle');
            ctx.setFontSize(14);
            ctx.setFillStyle('#000');
            if (this.data.sendName.length >= 8) {
              var title = this.data.sendName.substring(0, 7) + '...'
            } else {
              var title = this.data.sendName
            }
            ctx.fillText(title, this.data.windowW/3,this.data.windowH/2.7, this.data.windowH/4.7);
            ctx.stroke();
            ctx.draw();
          }
        })
      }
        })
      }
    })
  },
  // 保存到手机
  saveImage: function (e) {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        console.log("res4",res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            wx.showToast({
              title: '图片保存成功',
              icon: 'success',
              duration: 2000
            })
          }
        })
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