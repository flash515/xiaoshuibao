const app = getApp()
var utils = require("../../utils/utils")
const wxpay = require("../../utils/WxPay");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoshares: [], //已保存的资讯分享
    infoshare: [], //当前要编辑的资讯
    sysvideos: [], //系统预存视频
    sysimages: [], //系统预存图片
    infoid: "",
    infotitle: "",
    infocontent: "",
    infovideo: "", //用户选定的视频，一个
    infoimages: [], //用户选定的图片组，多张
    likepoints: 0, //资讯获赞数
    adddate: "", //资讯创建时间
    videourl: '',
    videocontent: "",
    danmuList: [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }],
    tempvideourl: [], //用户上传视频的临时路径
    tempimageview: [], //用户上传图片的临时路径
    sptemp: "", //视频路径转换的中间临时变量
    videouploadlock: false, //视频上传锁定状态
    imageuploadlock: false, //图片上传锁定状态
    editstatus: false, //编辑状态
  },
  bvInfoShareSelect(e) {
    console.log(e.detail.cell)
    this.setData({
      infoid:e.detail.cell.InfoId,
        infotitle: e.detail.cell.InfoTitle,
        infocontent: e.detail.cell.InfoContent,
        infovideo: e.detail.cell.VideoUrl,
        infoimages: e.detail.cell.ImagesUrl,
        infostatus:  e.detail.cell.InfoStatus,
    })
    this.setData({
      sptemp: e.detail.cell.VideoUrl
    })
  },

  bvInfoTitle(e) {
    this.setData({
      infotitle: e.detail.value
    })
  },
  bvInfoContent(e) {
    this.setData({
      infocontent: e.detail.value
    })
  },

  bvVideoSelect(e) {
    //从系统视频中选取
    console.log(e.detail.cell)
    this.setData({
      infovideo: e.detail.cell,
      sptemp: e.detail.cell.videourl
    })
  },
  bvImageSelect(e) {
    //从系统图片中选取
    console.log(e.detail.key)
    this.setData({
      infoimages: [e.detail.key]
    })
    console.log("infoimages", this.data.infoimages)
  },

  async bvChooseImage(e) {
    // 选择自有背景,使用单个文件上传，返回字符型结果
    console.log(e.detail.current)
    let cloudpath1 = 'infoshare/' + app.globalData.Guserdata.UserInfo.UserPhone + '/'+app.globalData.Guserdata.UserInfo.UserPhone+'infoimage'
    var files1 = await utils._UploadFile(e.detail.current, cloudpath1)
    this.setData({
      imageview: [files1],
    })
    console.log(this.data.infoimages)
  },

  bvRemoveImage(e) {
    console.log(e.detail.current)
    wx.cloud.deleteFile({
      fileList: [e.detail.current],
      success: res => {
        console.log(res)
        this.setData({
          infoimages:[],
        })
      }
    })
  },

  bvChooseVideo(e) {
    let that = this
    console.log("上传视频的方法")
    wx.chooseMedia({
      count: 1, //上传视频的个数
      mediaType: ['video'], //限制上传的类型为video
      sourceType: ['album', 'camera'], //视频选择来源
      maxDuration: 58, //拍摄限制时间
      camera: 'back', //采用后置摄像头
      success: function (res) {
        //获取临时存放的视频资源
        let tempFilePath = res.tempFiles[0].tempFilePath
        //获取该视频的播放时间
        let duration = res.tempFiles[0].duration
        console.log("视频播放时间为" + duration)
        //获取视频的大小(MB单位)
        let size = parseFloat(res.tempFiles[0].size / 1024 / 1024).toFixed(1)
        console.log("视频大小为" + size)
        //获取视频的高度
        let height = res.tempFiles[0].height
        console.log("视频高度为" + height)
        //获取视频的宽度
        let width = res.tempFiles[0].width
        console.log("视频宽度为" + width)
        //校验大小后，符合进行上传
        if (size > 20) {
          let beyongSize = size - 20 //获取视频超出限制大小的数量
          Toast("上传的视频大小超限,超出" + beyongSize + "MB,请重新上传！")
          return
        } else {
          //符合大小限制，进行上传
          console.log("可以上传！！！")
          that.uploadvideo({
            // url: api.uploadfiletofastdfs, //视频上传的接口
            path: tempFilePath, //选取的视频资源临时地址
          });
        }
      },
    })
  },


  //视频上传
  uploadvideo: function (data) {
    wx.showLoading({
      title: '上传中...',
      mask: true,
    })
    var that = this
    //    视频压缩
    wx.compressVideo({
      quality: 'high',
      src: data.path,
      success: function (res) {
        let size = parseFloat(res.size / 1024 / 1024).toFixed(1)
        console.log("压缩后视频大小为" + size)
        that.setData({
          sptemp: res.tempFilePath
        })

        // 只上传一个video时
        const filePath = that.data.sptemp
        const cloudPath = 'infoshare/' + app.globalData.Guserdata.UserInfo.UserPhone + '/' + app.globalData.Guserdata.UserInfo.UserPhone + filePath.match(/\.[^.]+?$/)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => {
            wx.hideLoading();
            console.log(res)
            console.log("fileID", res.fileID)
            this.data.infovideo = [res.fileID]
            this.data.videouploadlock = true // 修改上传状态为锁定
            console.log("infovideo", this.data.infovideo)
          },
        });
      },
    })
  },

  bvEdit: function (e) {

  },

  //发布到资讯广场
  async bvPublish(e) {
    if (this.data.infoshares.length < 3) {
      // 会员只能发布最多3条资讯
      const db = wx.cloud.database()
      db.collection('INFOSHARE').add({
        data: {
          UserId: app.globalData.Guserid,
          InfoId: app.globalData.Guserdata.UserInfo.UserPhone + new Date().getTime(),
          InfoTitle: this.data.infotitle,
          InfoContent: this.data.infocontent,
          VideoUrl: this.data.infovideo,
          ImagesUrl: this.data.infoimages,
          LikePoints: 0,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          InfoStatus: "unchecked",
        },
        success: res => {
          utils._SuccessToast("已保存")
        },
        fail: res => {
          utils._ErrorToast("保存失败请重试")
        }
      })
    } else {
      utils._ErrorToast("超过数量限制")

    }
  },

  //保存信息
  async bvUpdate(e) {
      // 再次发布是更新
      const db = wx.cloud.database()
      db.collection('INFOSHARE').where({
        InfoId: this.data.infoid
      }).update({
        data: {
          InfoTitle: this.data.infotitle,
          InfoContent: this.data.infocontent,
          VideoUrl: this.data.infovideo,
          ImagesUrl: this.data.infoimages,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          InfoStatus: "unchecked",
        },
        success: res => {
          utils._SuccessToast("资讯更新成功")
        },
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      sysvideos: app.globalData.Gsetting.infovideos,
      sysimages: app.globalData.Gsetting.infoimages,
    })
    // 查询本人提交的InfoShare
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "INFOSHARE",
        command: "and",
        where: [{
          UserId: app.globalData.Guserid,
        }]
      },
      success: res => {
        this.setData({
          infoshares: res.result.data,
        })
        console.log("本人全部资讯", this.data.infoshares)
      }
    })
  },

  bindInputBlur(e) {
    this.inputValue = e.detail.value
  },

  bindButtonTap() {
    const that = this
    wx.chooseMedia()({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: res => {
        that.setData({
          videourl: res.tempFilePath
        })
      }
    })
  },

  bindVideoEnterPictureInPicture() {
    console.log('进入小窗模式')
  },

  bindVideoLeavePictureInPicture() {
    console.log('退出小窗模式')
  },

  bindPlayVideo() {
    console.log('1')
    this.videoContext.play()
  },
  bindSendDanmu() {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: this.getRandomColor()
    })
  },

  videoErrorCallback(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
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
  // 分享朋友圈
  onShareTimeline: function () {
    return {
      title: this.data.infotitle,
      query: '/pages/promote/infoshare?userid=' + app.globalData.Guserid+ '&infoid=' + this.data.infoid,
      imageUrl: '', //封面
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.infotitle,
      path: '/pages/promote/infoshare?userid=' + app.globalData.Guserid + '&infoid=' + this.data.infoid,
      imageUrl: '', //封面，留空自动抓取500*400生成图片
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(this.data.path.value)
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
  }
})