// pages/mine/poster.js
const app = getApp()
const { startToTrack, startByClick, startByBack } = require("../../utils/track");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播参数
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    tempbgpicurl: "", // //临时图片的路径
    countIndex: 1, // 可选图片剩余的数量
    imageData: [], // 所选上传的图片数据
    windowW: "", // 画布宽度
    windowH: "", // 画布高
    qrcodeurl: "", //小程序码地址
    sendName: "", // 用户名
    cardPath: "", //背景地址
    headPath: "" //头像地址
  },
  checkQRCode: function () {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('USER').where({
      _openid: app.globalData.Gopenid,
      // _openid:'omLS75Xib_obyxkVAahnBffPytcA'
    }).get({
      success: res => {
        console.log(res);
        console.log(res.data[0].QRCode);
        if (res.data[0].QRCode == undefined) {
          wx.showModal({
            title: '提示',
            content: '您还没有专属小税宝推广码，请先到推广码页面获取吧！',
            success: function (res) {
              if (res.confirm) {
                console.log('确定')
                wx.navigateTo({
                  url: '../mine/minicode',
                })
              } else if (res.cancel) {
                console.log('取消')
              }
            }
          })
        } else {
          this.setData({
            qrcodeurl: res.data[0].QRCode,
            headPath: res.data[0].QRCode,
            sendName: "小税宝推广大使" + res.data[0].UserName
          })
          this.getPicture()
        }
      }
    })
  },
  /*图片浏览及上传 */
  getPicture: function () {
    // let that = this;

    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: (res) => {
        console.log(res);
        // 选择图片后的完成确认操作
        this.setData({
          tempbgpicurl: res.tempFilePaths[0],
          cardPath: res.tempFilePaths[0]
        });
        console.log(this.data.tempbgpicurl);
      }
    })
  },

  drawCanvas: function () {
    // var that = this;
    let ctx = wx.createCanvasContext('myCanvas');
    wx.getImageInfo({
      src: this.data.tempbgpicurl,
      success: (res) => {
        console.log("res2", res)
        ctx.drawImage(res.path, 0, 0, this.data.windowW, this.data.windowH); // 背景
        ctx.setFontSize(20) //字体大小
        ctx.setFillStyle('blue') //字体颜色
        ctx.textAlign = "center"; //文字居中
        ctx.fillText(this.data.sendName, this.data.windowW / 2, (this.data.windowH * 0.75 + this.data.windowW * 0.2 + 15))
        ctx.stroke();
        ctx.save()
        wx.getImageInfo({
          src: this.data.qrcodeurl,
          success: (res) => {
            console.log("res3", res)
            ctx.drawImage(res.path, this.data.windowW * 0.4, this.data.windowH * 0.75, this.data.windowW * 0.2, this.data.windowW * 0.2); //小程序码
            ctx.restore();
            ctx.draw();
          }
        })
      }
    })

  },
  drawCanvasH: function () {
    // var that = this;
    let ctx = wx.createCanvasContext('myCanvasH');
    wx.getImageInfo({
      src: this.data.tempbgpicurl,
      success: (res) => {
        console.log("res2", res)
        ctx.drawImage(res.path, 0, 0, 1500, 2100); // 高清版背景
        ctx.setFontSize(100) //字体大小
        ctx.setFillStyle('blue') //字体颜色
        ctx.textAlign = "center"; //文字居中
        ctx.fillText(this.data.sendName, 750, 1950)
        ctx.stroke();
        ctx.save()
        wx.getImageInfo({
          src: this.data.qrcodeurl,
          success: (res) => {
            console.log("res3", res)
            ctx.drawImage(res.path, 600, 1575, 300, 300); //小程序码
            ctx.restore();
            ctx.draw(true, () => {
              this.saveImage()
            });
          }
        })
      }
    })
  },
  // 保存到手机
  saveImage: function (e) {
    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'myCanvasH',
      fileType: 'jpg', //图片的质量，目前仅对 jpg 有效。取值范围为 (0, 1]，不在范围内时当作 1.0 处理。
      quality: 1,
      success: function (res) {
        console.log("res4", res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            wx.showToast({
              title: '海报保存成功',
              icon: 'success',
              duration: 2000
            })
            // 判断是否重复提交
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image:app.globalData.Gimagearray,
      windowW: (app.globalData.Gsysteminfo.windowWidth - 40),
      windowH: (app.globalData.Gsysteminfo.windowWidth - 40) * 1.4

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})