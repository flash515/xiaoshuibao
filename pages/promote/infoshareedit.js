const app = getApp()
var utils = require("../../utils/utils")
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    avatarurl: "",
    nickname: "",
    infoshares: [], //已保存的资讯分享
    infoshare: [], //当前要编辑的资讯
    infoselected: false,
    infoid: "",
    infotitle: "",
    infotitleshow: true,
    private: false,
    infostatus: "unchecked",
    infocontent: "",
    infoimage: "", //用户选定的图片组，多张
    infovideo: '',
    tempvideourl: [], //用户上传视频的临时路径
    tempimageview: [], //用户上传图片的临时路径
    sptemp: "", //视频路径转换的中间临时变量
    thumbtemp: "",
    infocover: "",
  },

  onChooseAvatar(e) {
    console.log(e.detail)
    const cloudPath = 'user/' + app.globalData.Guserid + '/' + "avatarUrl" + e.detail.avatarUrl.match(/\.[^.]+?$/)
    wx.cloud.uploadFile({
      cloudPath, // 上传至云端的路径
      filePath: e.detail.avatarUrl, // 小程序临时文件路径
      success: res => {
        // 返回文件 ID
        console.log(res.fileID)
        // do something
        this.setData({
          avatarurl: res.fileID,
        })
        db.collection('USER').where({
          UserId: app.globalData.Guserid
        }).update({
          data: {
            ["UserInfo.avatarUrl"]: res.fileID,
          },
          success: res => {
            utils._SuccessToast("头像已更新")
          }
        })
      },
      fail: console.error
    })

  },

  bvNickName(e) {
    console.log("真机测试才能获取到", e.detail.value)
    this.setData({
      nickname: e.detail.value,
    })

  },
  bvUploadNickName(e){
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        ["UserInfo.nickName"]: this.data.nickname,
      },
      success: res => {
        utils._SuccessToast("昵称已更新")
      }
    })
  },

  bvInfoShareSelect(e) {
    console.log(e.detail)
    this.setData({
      infoselected: e.detail.checked,
      infoid: e.detail.cell.InfoId,
      infotitle: e.detail.cell.InfoTitle,
      infotitleshow: e.detail.cell.InfoTitleShow,
      private: e.detail.cell.Private,
      infocontent: e.detail.cell.InfoContent,
      infovideo: e.detail.cell.InfoVideo,
      infocover: e.detail.cell.InfoCover,
      infoimage: e.detail.cell.InfoImage,
      infostatus: e.detail.cell.InfoStatus,
      thumbtemp: e.detail.cell.InfoCover,
    })
    this.setData({
      sptemp: e.detail.cell.InfoVideo
    })
  },

  async bvDelInfo(e) {
    console.log(e)
    let that = this
    await utils._RemoveFiles([e.currentTarget.dataset.video])
    await utils._RemoveFiles([e.currentTarget.dataset.cover])
    await utils._RemoveFiles([e.currentTarget.dataset.image])
    const db = wx.cloud.database()
    await db.collection('INFOSHARE').where({
      InfoId: e.currentTarget.dataset.id
    }).remove({
      success: res => {
        utils._SuccessToast("资讯删除成功")
        // 查询本人提交的InfoShare
        this.data.infoshares.splice(e.currentTarget.dataset.index, 1)
        this.setData({
          infoshares: this.data.infoshares
        })
      }
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

  async bvChooseImage(e) {
    // 选择自有背景,使用单个文件上传，返回字符型结果,current是数组
    console.log(e.detail.current)
    let cloudpath1 = 'infoshare/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'infoimage' + new Date().getTime()
    var files1 = await utils._UploadFile(e.detail.current[0], cloudpath1)
    this.setData({
      infoimage: files1,
    })
    console.log(this.data.infoimage)
  },

  async bvRemoveImage(e) {
    console.log(e.currentTarget.dataset.image)
    await utils._RemoveFiles([e.currentTarget.dataset.image])
    this.setData({
      infoimage: "",
    })
  },

  async bvChooseMedia(e) {
    let that = this
    console.log("上传视频的方法")
    wx.chooseMedia({
      count: 1, //上传视频的个数
      mediaType: ['video'], //限制上传的类型为video
      sourceType: ['album', 'camera'], //视频选择来源
      maxDuration: 58, //拍摄限制时间
      camera: 'back', //采用后置摄像头
      success: async function (res) {
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
        that.setData({
          thumbtemp: res.tempFiles[0].thumbTempFilePath,
        })
        if (size > 20) {
          let beyongSize = size - 20 //获取视频超出限制大小的数量
          Toast("上传的视频大小超限,超出" + beyongSize + "MB,请重新上传！")
          return
        } else {
          //符合大小限制，进行上传
          console.log("可以上传！！！")
          // 调用视频上传方法
          let timestamp = new Date().getTime()
          that.uploadvideo({
            // url: api.uploadfiletofastdfs, //视频上传的接口
            path: tempFilePath, //选取的视频资源临时地址
            timestamp: timestamp
          });

        }
      },
    })
  },


  //视频上传
  uploadvideo: async function (data) {
    wx.showLoading({
      title: '上传中...',
      mask: true,
    })
    var that = this
    // 上传视频封面
    let cloudpath1 = 'infoshare/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'infocover' + data.timestamp;
    that.data.infocover = await utils._UploadFile(that.data.thumbtemp, cloudpath1)
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
        const cloudPath = 'infoshare/' + app.globalData.Guserid + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'infovideo' + data.timestamp + filePath.match(/\.[^.]+?$/)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: (res) => {
            wx.hideLoading();
            console.log("fileID", res.fileID)
            that.setData({
              infovideo: res.fileID,
            })
          },
        });
      },
    })
  },

  drawCanvas: function () {
    // var that = this;
    let ctx = wx.createCanvasContext('myCanvas');
    wx.getImageInfo({
      src: this.data.thumbtemp,
      success: (res) => {
        console.log("res2", res)
        if (res.width * 0.8 < res.height) {
          var x = res.width
          var y = res.width * 0.8
        } else if (res.width * 0.8 == res.height) {
          var x = res.width
          var y = res.width * 0.8
        } else if (res.width * 0.8 > res.height) {
          var x = res.height * 1.25
          var y = res.height
        }
        ctx.drawImage(res.path, 0, 0, x, y, 0, 0, 500, 400); // 背景
        ctx.save()
        ctx.draw();
      }
    })

  },

  async bvDelVideo(e) {
    console.log(e)
    await utils._RemoveFiles([this.data.infovideo])
    await utils._RemoveFiles([this.data.infocover])
    utils._SuccessToast("视频删除成功")
    this.setData({
      infovideo: "",
      infocover: "",
      thumbtemp: "",
    })
  },

  bvInfoTitleShow(e) {
    console.log(e.detail)
    this.data.infotitleshow = e.detail.checked
  },
  bvPrivate(e) {
    console.log(e.detail)
    this.data.private = e.detail.checked
  },
  //发布到资讯广场
  async bvPublish(e) {
    let that = this
    if (this.data.infotitle == "") {
      utils._ErrorToast("标题不能为空")
      return
    }
    // 普能会员只能发布最多3条资讯
    if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "member" && this.data.infoshares.length > 2) {
      utils._ErrorToast("超出会员权限")
      return
    }
    // 银级会员只能发布最多10条资讯
    if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "silver" && this.data.infoshares.length > 9) {
      utils._ErrorToast("超出会员权限")
      return
    }
    // 黄金会员只能发布最多30条资讯
    if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "gold" && this.data.infoshares.length > 29) {
      utils._ErrorToast("超出会员权限")
      return
    }
    // 铂金会员只能发布最多50条资讯
    if (app.globalData.Guserdata.TradeInfo.PromoteLevel == "platinum" && this.data.infoshares.length > 49) {
      utils._ErrorToast("超出会员权限")
      return
    }
    console.log("测试是否执行")

    // 会员只能发布最多3条资讯
    // 不公开发布不需要审核
    if (this.data.private == true) {
      this.data.infostatus = "checked"
    }
    const db = wx.cloud.database()
    db.collection('INFOSHARE').add({
      data: {
        CreatorId: app.globalData.Guserid,
        InfoId: app.globalData.Guserdata.UserInfo.UserPhone + new Date().getTime(),
        InfoTitle: this.data.infotitle,
        InfoContent: this.data.infocontent,
        InfoVideo: this.data.infovideo,
        InfoImage: this.data.infoimage,
        InfoCover: this.data.infocover,
        View: 0,
        Praise: 0,
        Commont: 0,
        InfoTitleShow: this.data.infotitleshow,
        Private: this.data.private,
        avatarUrl: this.data.avatarurl,
        nickName: this.data.nickname,
        PublishDate: new Date().toLocaleString('chinese', {
          hour12: false
        }),
        InfoStatus: this.data.infostatus,
      },
      success: res => {
        utils._SuccessToast("资讯已创建")
        // 查询本人提交的InfoShare
        wx.cloud.callFunction({
          name: "NormalQuery",
          data: {
            collectionName: "INFOSHARE",
            command: "and",
            where: [{
              CreatorId: app.globalData.Guserid,
            }]
          },
          success: res => {
            that.setData({
              infoshares: res.result.data,
            })
            console.log("本人全部资讯", that.data.infoshares)
          }
        })

      },
      fail: res => {
        utils._ErrorToast("保存失败请重试")
      }
    })


  },

  //保存信息
  async bvUpdate(e) {
    // 再次发布是更新
    let that = this
    if (this.data.infotitle == "") {
      utils._ErrorToast("标题不能为空")
    } else {
      if (this.data.private == true) {
        this.data.infostatus = "checked"
      }
      const db = wx.cloud.database()
      db.collection('INFOSHARE').where({
        InfoId: this.data.infoid
      }).update({
        data: {
          InfoTitle: this.data.infotitle,
          InfoContent: this.data.infocontent,
          InfoVideo: this.data.infovideo,
          InfoImage: this.data.infoimage,
          InfoCover: this.data.infocover,
          InfoTitleShow: this.data.infotitleshow,
          Private: this.data.private,
          avatarUrl: this.data.avatarurl,
          nickName: this.data.nickname,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          InfoStatus: this.data.infostatus,
        },
        success: res => {
          utils._SuccessToast("资讯更新成功")
          // 查询本人提交的InfoShare
          wx.cloud.callFunction({
            name: "NormalQuery",
            data: {
              collectionName: "INFOSHARE",
              command: "and",
              where: [{
                CreatorId: app.globalData.Guserid,
              }]
            },
            success: res => {
              that.setData({
                infoshares: res.result.data,
              })
              console.log("本人全部资讯", that.data.infoshares)
            }
          })
        },
      })
      db.collection('USER').where({
        UserId: app.globalData.Guserid
      }).update({
        data: {
          ["UserInfo.avatarUrl"]: this.data.avatarurl,
          ["UserInfo.nickName"]: this.data.nickname,
        },
        success: res => {}
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    //  await utils.UserLogon()
    this.setData({
      avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickname: app.globalData.Guserdata.UserInfo.nickName,
    })
    // 查询本人提交的InfoShare
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "INFOSHARE",
        command: "and",
        where: [{
          CreatorId: app.globalData.Guserid,
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

  bindButtonTap() {
    const that = this
    wx.chooseMedia()({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: res => {
        that.setData({
          infovideo: res.tempFilePath
        })
      }
    })
  },

  bindPlayVideo() {
    console.log('1')
    this.videoContext.play()
  },

  bindInputBlur(e) {
    this.inputValue = e.detail.value
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
      query: '/pages/promote/infoshare?userid=' + app.globalData.Guserid + '&infoid=' + this.data.infoid,
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