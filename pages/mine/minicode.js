// pages/mine/qrcode.js
const app = getApp()
const { startToTrack, startByClick, startByBack } = require("../../utils/track");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    windowW: '', // 画布宽度
    windowH: '', // 画布高，没用到

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
    inviterid: "",
    accessToken: "",
    token_url: "",
    urllink: "",
    qrcodeurl: "",
    tempqrcodeurl: "",
    avatarUrl: "",
    tempfilepath: "",
    qrcodeuploadlock: false
  },
  //单独打开该页时取得用户id,实际应该用不到
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },
  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: "获取你的头像以生成小程序码",
      success: res => {
        console.log("获得的用户微信信息", res)
        this.setData({
          avatarUrl: res.userInfo.avatarUrl
        })
        console.log("获得的用户头像地址", res.userInfo.avatarUrl)
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
          title: '头像已更新',
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
  getUrlLink() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'URLLink',
      data: {
        quey: 'userid=' + app.globalData.Gopenid
      },
      success: res => {
        console.log('result', res.result)
        console.log('urllink', res.result.urlLink)
        this.setData({
          urllink: res.result.urlLink
        })
      },
      fail: err => {
        console.error('[云函数] [URLLink] 调用失败', err)
      }
    })
  },
  copy:function(e){
    let that=this;
    wx.setClipboardData({
      data: that.data.urllink, //这个是要复制的数据
      success (res) {
        wx.getClipboardData({
          success (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  getQRCode() {
    // 调用云函数
    // var scene = app.globalData.Gopenid; //scene参数不能有参数名，可以拼接你要添加的参数值

    let that = this;
    wx.cloud.callFunction({
      name: 'getQRCode',
      data: {
        userid: app.globalData.Gopenid,
        scene: app.globalData.Gopenid
        // userid: "1234",
        // scene: "5678"
      },
      success: res => {
        console.log("tempqrcodeurl", res.result);
        that.setData({
          tempqrcodeurl: res.result
        })
        // 执行下一个方法的方法
        that.drawCanvas()
      }
    })
  },


  //获取二维码，有效，但当前方法用不到了
  getcode(getAccessToken) {
    var that = this;
    var scene = app.globalData.Gopenid; //scene参数不能有参数名，可以拼接你要添加的参数值
    console.log('scene：', scene);
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + this.data.accessToken,
      data: {
        scene: scene,
        page: 'pages/index/index', //线上的小程序一定要有这个页面
      },
      method: 'POST',
      responseType: 'arraybuffer',
      success: function (res) {
        // var qrcode = wx.arrayBufferToBase64(res.data); //对数据进行转换
        that.setData({
          qrcode: wx.arrayBufferToBase64(res.data) //对数据进行转换
        })
        // console.log("小程序码", that.data.qrcode);
        //保存base64小程序码到本地临时文件
        // data为base64的图片数据（注意：没有前缀 data:image/png;base64,）
        let random = new Date().getTime();
        let tempPath = wx.env.USER_DATA_PATH + `/${random}.png`;
        wx.getFileSystemManager().writeFile({
          filePath: tempPath,
          data: that.data.qrcode,
          encoding: 'base64',
          success: res => {
            that.setData({
              ewmPath: tempPath
            })
            console.log('success', that.data.ewmPath);
            // that.drawCanvas();
          },
          fail: err => {
            console.log(err);
          }
        })
      }
    })
  },

  drawCanvas: function () {
    // var that = this;
    let ctx = wx.createCanvasContext('myCanvas');
    wx.getImageInfo({
      src: this.data.tempqrcodeurl,
      success: (res) => {
        console.log("res2", res)
        ctx.drawImage(res.path, 0, 0, this.data.windowW, this.data.windowW); // 二维码
        ctx.save()
        ctx.beginPath()
        // 画圆弧，圆心坐标、半径、弧长
        ctx.arc(this.data.windowW / 2, this.data.windowW / 2, this.data.windowW * 0.2333, 0, 2 * Math.PI)
        ctx.closePath()
        // 下面就裁剪出一个圆形了，且坐标在 （50， 90）
        ctx.clip()
        // 然后画图片，res.tempFilePath 其实是下载到本地的一个路径，使用小程序画出图片记得一定要用本地的路径，可以用 wx.downloadFile 来实现。
        // 因为 drawImage 的第二个和第三个参数是图片的左上角在画布 canvas 的 x 坐标，y 坐标，所以图片的坐标比圆形的坐标分别都小圆的半径大小就刚刚好能被切成圆形，后面的两个参数就是图片的宽和高，请设定为圆形的直径长度。

        wx.getImageInfo({
          src: this.data.avatarUrl,
          success: (res) => {
            console.log("res3", res)
            ctx.drawImage(res.path, this.data.windowW * 0.2667, this.data.windowW * 0.2667, this.data.windowW * 0.4667, this.data.windowW * 0.4667); //头像
            ctx.restore();
            ctx.draw();
          }
        })
      }
    })

  },
  // 保存到手机
  saveImage: function (e) {
    let that = this
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function (res) {
        console.log("res4", res)
        that.setData({
          tempfilepath: res.tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(result) {
            wx.showToast({
              title: '推广码保存成功',
              icon: 'success',
              duration: 2000
            })
            console.log("res5", that.data.qrcodeuploadlock)
            that.uploadqrcode()
          }
        })
      }
    })

  },
  uploadqrcode() {
    // 判断是否重复提交
    if (this.data.qrcodeuploadlock) {} else {
      console.log("res6", this.data.tempfilepath)
      const filePath = this.data.tempfilepath
      const cloudPath = app.globalData.Gopenid + '/' + 'qrcode.png'
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log("fileID", res.fileID)
          // 获取数据库引用
          const db = wx.cloud.database()
          // 更新数据
          db.collection('USER').where({
            _openid: app.globalData.Gopenid
          }).update({
            data: {
              QRCode: res.fileID
            },
          })
        }
      })
      this.data.qrcodeuploadlock = true // 修改上传状态为锁定
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowW: app.globalData.Gsysteminfo.windowWidth - 40,
      windowH: app.globalData.Gsysteminfo.windowWidth - 40,
      image: app.globalData.Gimagearray,
      avatarUrl: app.globalData.Guserinfo.avatarUrl,
      nickName: app.globalData.Guserinfo.nickName,
    })
    var that = this;
    // 接收参数的方法开始
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      //&是我们定义的参数链接方式
      let inviterid = scene.split('&')[0];
      // let userId = scene.split("&")[1];
      //其他逻辑处理。。。。。
    }
    //  接收参数的方法结束

    // wx.getSystemInfo({ // 获取设备宽高 canvas设置  由于项目需求背景图不是整屏  我把高减少一部分
    //   success: function (res) {
    //     that.setData({
    //       windowW: res.windowWidth - 40,
    //       windowH: res.windowWidth - 40
    //     })
    //   }
    // })

    // 获取accesstoken,当前方法用不到accessToken了

    // wx.cloud.callFunction({
    //     // 云函数名称
    //     name: 'getAccessToken',
    //     // 传给云函数的参数
    //     data: {},
    //   })
    //   .then(res => {
    //     this.setData({
    //       accessToken: res.result
    //     });
    //     console.log('云函数获取res.result：', res.result);
    //     console.log('云函数获取this.data.accessToken：', this.data.accessToken);
    //   })
    //   .catch(console.error)
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