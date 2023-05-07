const app = getApp()
var utils = require("../../utils/utils")
const wxpay = require("../../utils/WxPay");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 初始化相关
    params: {},
    inviterid: "",
    tempinviterid: "",
    remark: "",
    indirectinviterid: "",
    userinfo: {},
    // 登录框相关变量
    loginshow: false,
    time: "获取验证码",
    currentTime: 60,
    disabledstatus: false,
    inputphone: "",
    s_phonecode: "",
    u_phonecode: "",
    // 页面相关
    infoshares: [],
    tempinfoid:"",
    comments: [],
    infoid: "",
    avatarurl:"",
    nickname:"",
    donateshow: false,
    commentshow: false,
    replyshow: false,
    praise: 50,
    praisepoints: 0,
    totalfee: 0,
    infoshow: true,
    inputValue: '',
    infotitle: "",
    infovideo: "",
    adddate: "",
    infocontent: "",
    donate: [{
      praisepoints: 50,
      price: 5,
      creatorpoints: 2.5,
      inviterpoints: 0.75,
      indirectinviterpoints: 0.25,
    }, {
      praisepoints: 110,
      price: 10,
      creatorpoints: 5,
      inviterpoints: 1.5,
      indirectinviterpoints: 0.5,
    }, {
      praisepoints: 230,
      price: 20,
      creatorpoints: 10,
      inviterpoints: 3,
      indirectinviterpoints: 1,
    }, {
      praisepoints: 350,
      price: 30,
      creatorpoints: 15,
      inviterpoints: 4.5,
      indirectinviterpoints: 1.5,
    }],
    viList: [{
        vio: 'https://assets.mixkit.co/videos/preview/mixkit-movement-in-a-large-avenue-at-night-in-timelapse-44688-large.mp4',
        avatar: 'https://profile-avatar.csdnimg.cn/6ef2193c2e9649c88356336c626e5777_m0_64944135.jpg',
        name: 'xiaoshen'
      },
      {
        vio: 'https://assets.mixkit.co/videos/preview/mixkit-movement-in-a-large-avenue-at-night-in-timelapse-44688-large.mp4',
        avatar: '	https://profile.csdnimg.cn/7/A/9/1_2201_75886543',
        name: 'kami'
      }
    ]
  },
  bvDonateShow() {
    this.setData({
      donateshow: !this.data.donateshow
    })
  },
  bvComment(e) {
    this.setData({
      comment: e.detail.value,
    })
  },
  bvCommentShow() {
    this.setData({
      commentshow: true,
    })
    // if (app.globalData.Guserdata.UserInfo.UserPhone == '' || app.globalData.Guserdata.UserInfo.UserPhone == undefined) {
    //   // 非会员先调用登录框
    //   this.setData({
    //     loginshow: true
    //   })
    // } else {
    //   this.setData({
    //     commentshow:true,
    //   })
    // }
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

  bvPublish() {
    if (this.data.avatarurl == "" || this.data.nickname == "") {
      utils._ErrorToast("需要头像和昵称")
    } else {
      // 新增留言
      const db = wx.cloud.database()
      db.collection("InfoShareComment").add({
        data: {
          InfoId: this.data.tempinfoid,
          UserId: app.globalData.Guserid,
          avatarUrl: this.data.avatarurl,
          nickName: this.data.nickname,
          Location: this.data.location,
          Comment: this.data.comment,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          Status: "unchecked",
        },
        success: res => {
          this.setData({
            replyshow: false
          })
        },
        fail: res => {
          utils._ErrorToast("提交失败请重试")
        }
      })
    }
  },
  bvEdit: function (e) {
    if (app.globalData.Guserdata.UserInfo.UserPhone == '' || app.globalData.Guserdata.UserInfo.UserPhone == undefined) {
      this.setData({
        loginshow: true
      })
    } else {
      wx.navigateTo({
        url: '../promote/infoshareedit',
      })
    }
  },
  bvDonateSelect(e) {
    console.log(e.detail.cell)
    this.setData({
      totalfee: e.detail.cell.price,
      points: e.detail.cell.points
    })
  },

  // 点击支付按钮,发起支付
  bvToDonate(event) {
    const goodsnum = wxpay._getGoodsRandomNumber();
    const body = "资讯打赏";
    const PayVal = this.data.totalfee * 100;
    this._callWXPay(body, goodsnum, PayVal);
  },
  // 请求WXPay云函数,调用支付能力
  _callWXPay(body, goodsnum, payVal) {
    let that = this
    wx.cloud.callFunction({
        name: 'WXPay',
        data: {
          // 需要将data里面的参数传给WXPay云函数
          body,
          goodsnum, // 商品订单号不能重复
          payVal, // 这里必须整数,不能是小数,而且类型是number,否则就会报错
        },
      })
      .then((res) => {
        console.log(res);
        const payment = res.result.payment;
        console.log(payment); // 里面包含appId,nonceStr,package,paySign,signType,timeStamp这些支付参数
        wx.requestPayment({
          // 根据获取到的参数调用支付 API 发起支付
          ...payment, // 解构参数appId,nonceStr,package,paySign,signType,timeStamp
          success: (res) => {
            console.log('支付成功', res);
            wxpay._orderupdate();
            wxpay._paymentupdate();
            wxpay._userupdate();
            that.setData({
              paymenthidden: true
            })
          },
          fail: (err) => {
            console.error('支付失败', err);
          },
        });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  _orderadd() {
    let that = this
    if (this.data.ordersublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      // 新增数据
      db.collection("DISCOUNTORDER").add({
        data: {
          OrderId: this.data.orderid,
          DiscountLevel: this.data.discountlevel,
          DiscountId: this.data.discountid,
          DiscountName: this.data.discountname,
          DiscountType: this.data.discounttype,
          DLStartDate: this.data.discountstartdate,
          DLEndDate: this.data.discountenddate,
          TotalFee: this.data.discounttotalfee,
          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          PaymentStatus: "unchecked",
          OrderStatus: "unchecked",
          Available: false
        },
        success: res => {
          that.setData({
            ordersublock: true
          })
          that._hidden()
        },
        fail: res => {
          utils._ErrorToast("提交失败请重试")
        }
      })
    }
  },
  _paymentadd() {
    let that = this
    if (this.data.paymentsublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("PAYMENT").add({
        data: {
          OrderId: this.data.orderid,
          ProductId: this.data.discountid,
          ProductName: this.data.discountname,
          TotalFee: this.data.discounttotalfee,
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          PaymentStatus: "unchecked",
          Database: "DISCOUNTORDER"
        },
        success: res => {
          console.log("paymentadd成功")
          that.setData({
            paymentsublock: true,
          })
          that._hidden()
        },
        fail: res => {
          utils._ErrorToast("提交失败请重试")
        }
      })
    }
  },
  getRandomColor() {
    const rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length === 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  },

  onLoad: async function (options) {
    console.log("接收到的参数", options)
    if (options.userid) {
       // 如果是通过分享链接进入
       this.data.params = options
       this.data.remark = "通过小税宝用户分享资讯进入"
       this.setData({
         // 页面根据tempinviterid的值设置了显隐渲染，所以需要用setData赋值
         tempinviterid: options.userid
       })

      // 本地函数查询资讯信息
      const db = wx.cloud.database()
      db.collection('INFOSHARE').where({
        InfoId: options.infoid,
        InfoStatus: 'checked'
      }).get({
        success: res => {
          console.log(res)
          // 展示名片分享人的名片
          this.setData({
            infoshares: res.result.data,
          })
        }
      })
      // 通过分享进入，执行用户登录操作
      await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
    }else {
      // 在本人小程序中打开
      console.log("在本人小程序中打开")
    // 查询公开发布的视频
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "INFOSHARE",
        command: "and",
        where: [{
          InfoStatus: "checked",
        }]
      },
      success: res => {
        this.setData({
          infoshares: res.result.data,
        })
        this._getComments(this.data.infoshares[0].InfoId)
        console.log("本人全部资讯", this.data.infoshares)
      }
    })
    }
    this.setData({
      avatarurl:app.globalData.Guserdata.UserInfo.avatarUrl,
      nickname:app.globalData.Guserdata.UserInfo.nickName,
    })


    // 调用播放视频方法
    this.startUp()
  },
  _getComments(infoid) {
    // 云函数查询评论内容
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "InfoShareComment",
        command: "and",
        where: [{
          InfoId: infoid,
          Status:"checked"
        }]
      },
      success: res => {
        console.log(res)
        this.setData({
          comments: res.result.data
        })
      },
      fail: res => {
        console.log(res)
        this.setData({
          comments: []
        })
      }
    })
  },
  // 进页面时播放视频
  startUp() {
    // 获取video节点
    let createVideoContext = wx.createVideoContext('video0')
    // 播放视频
    createVideoContext.play()
  },

  // 切换视频的时候播放视频
  // 注：此方法视频如果过大可能会叠音，所以视频需要压缩，或者可以尝试循环节点关闭视频
  nextVideo(e) {
    this.data.tempinfoid=this.data.infoshares[e.detail.current].InfoId
    console.log(this.data.tempinfoid)
    // 播放当前页面视频
    let index = 'video' + e.detail.current
    this.playVio(index)
    // 暂停前一个页面视频
    if (e.detail.current - 1 >= 0) {
      let index1 = 'video' + (e.detail.current - 1)
      this.pauseVio(index1)
    }
    // 暂停后一个页面视频
    if (e.detail.current + 1 < this.data.viList.length) {
      let index2 = 'video' + (e.detail.current + 1)
      this.pauseVio(index2)
    }
    this._getComments(this.data.tempinfoid)
  },

  // 播放视频
  playVio(index) {
    // 获取video节点
    let createVideoContext = wx.createVideoContext(index)
    // 播放视频
    createVideoContext.play()
  },

  // 暂停视频
  pauseVio(index) {
    // 获取video节点
    let createVideoContext = wx.createVideoContext(index)
    // 暂停视频
    createVideoContext.pause()
  },

  // 分享朋友圈
  onShareTimeline: function () {
    return {
      title: this.data.sharetitle,
      query: '/pages/promote/infoshare?userid=' + app.globalData.Guserid,
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
      title: this.data.sharetitle,
      path: '/pages/promote/infoshare?userid=' + app.globalData.Guserid + '&infoid=' + this.data.tempinfoid,
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