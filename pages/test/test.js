const app = getApp();
// const uPng = require('upng-js');
// const {default:jsQR} = require('jsqr');
// const qrcodeParser = require('qrcode-parser');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //新增数据变量
    date1: "",
    date2: "",
    date3: "",
    date4: "",
    date5: "",
    date6: "",
    date7: "",
    date8: "",
    date9: "",
    url: "",
  },
  scanCode(src) {
    let that = this
    wx.scanCode({
      success: res => {
        console.log(res.result)
        if (res.result != "" && res.result != undefined) {
          this.setData({
            url: res.result
          })
          wx.navigateTo({
            url: '../tools/webpage?url=' + this.data.url,
          })
        }
      }
    })
  },

  handleImageLongpress(e){
    const src = e.currentTarget.dataset.src;
    wx.showActionSheet({itemList:['识别二维码']}).then((res) => {
this.scanCode(src)
    });
  },

  previewImage: function (e){
    console.log(e.target.dataset.src);
    var current = e.target.dataset.src;   //这里获取到的是一张本地的图片
    wx.previewImage({
      current: current,//需要预览的图片链接列表
    urls: [current]  //当前显示图片的链接
  })},
  bvRefresh(e) {
    console.log("刷新执行了")
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('POINTS').where(_.or([{
        RegistrantId: "omLS75Xib_obyxkVAahnBffPytcA",
        PointsStatus: "checked",
        // AddDate:_.gte(app.globalData.BalanceUpdateTime)
      },
      {
        InviterId: "omLS75Xib_obyxkVAahnBffPytcA",
        PointsStatus: "checked",
        // AddDate:_.gte(app.globalData.BalanceUpdateTime)
      },
      {
        IndirectInviterId: "omLS75Xib_obyxkVAahnBffPytcA",
        PointsStatus: "checked",
        // AddDate:_.gte(app.globalData.BalanceUpdateTime)
      }
    ])).get({
      success: res => {
        wx.setStorageSync('LPoints', res.data);
        // 查询结果赋值给数组参数
        console.log("云函数查询相关积分", res.data)
      },
      complete: res => {
        console.log(res)
      },
    })

  },

  snape() {

    let context = wx.createCanvasContext('canvasOne') //这里的“share”是“canvas-id”
    var img = "https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/namecard/bg12.jpg?sign=40579e0526436c3f321538fec64940f4&t=1681128645"
    context.setFillStyle('#fff') //这里是绘制白底，让图片有白色的背景
    context.fillRect(0, 0, 0, 0)

    context.drawImage(img, 0, 0, 130, 130) //绘制商品图片后面的数字分别代表图片左顶角的x，y坐标，右顶点的x，y坐标。

    context.setFontSize(10) //字体大小
    context.setFillStyle("#393939") //颜色
    context.fillText('zhanghao', 0, 130) //绘制描述字体
    console.log("====================================");
    //把画板内容绘制成图片，并回调画板图片路径
    context.draw(false, function () {
      wx.canvasToTempFilePath({ //把当前画布指定区域的内容导出生成指定大小的图片具体可看
        x: 0,
        y: 0,
        width: 50,
        height: 50,
        destWidth: 100,
        destHeight: 100,
        canvasId: 'canvasOne', //canvasOne是自己在wxml中定义的
        success: function (res) {
          console.log(res.tempFilePath);
          wx.saveImageToPhotosAlbum({ //保存图片到系统相册----缺点没有返回该图片的路径
            filePath: res.tempFilePath,
            success: function (res) {}
          })

        },
        fail: res => {
          wx.hideLoading()
          console.log("fail res:")
          console.log(res)
        }
      })
    })

  },
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    var date1 = new Date()
    var date2 = new Date().getTime()
    var date3 = new Date(1677827326678)
    var date4 = new Date(1677827326678).toLocaleString('chinese', {
      hour12: false
    })
    var date5 = new Date(1677827326678).toLocaleString()
    var date6 = new Date(1677827326678).toLocaleTimeString()
    var date7 = new Date(1677827326678).toLocaleString('chinese', {
      hour12: false
    }) //后台转换时间戳为24小时格式
    var date8 = new Date("2023/3/3 15:08:46").getTime()


    console.log(date1)

    console.log(date2)
    console.log(date3)
    console.log(date4)
    console.log(date5)
    console.log(date6)
    console.log(date7)
    console.log(date8)
  },
})
