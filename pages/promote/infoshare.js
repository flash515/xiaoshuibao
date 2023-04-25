const app = getApp()
var utils = require("../../utils/utils")
const wxpay = require("../../utils/WxPay");
var interval = null //倒计时函数
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
    inputphone:"",
    s_phonecode: "",
    u_phonecode: "",
    // 页面相关
    infoshareid: "",
    buylikeshow: false,
    like: 50,
    likepoints: 0,
    totalfee: 0,
    infoshow: true,
    inputValue: '',
    infotitle: "",
    infovideo: "",
    adddate: "",
    infocontent: "",
    buylikearray: [{
      likepoints: 50,
      price: 5,
      creatorpoints: 2.5,
      inviterpoints: 0.75,
      indirectinviterpoints: 0.25,
    }, {
      likepoints: 110,
      price: 10,
      creatorpoints: 5,
      inviterpoints: 1.5,
      indirectinviterpoints: 0.5,
    }, {
      likepoints: 230,
      price: 20,
      creatorpoints: 10,
      inviterpoints: 3,
      indirectinviterpoints: 1,
    }, {
      likepoints: 350,
      price: 30,
      creatorpoints: 15,
      inviterpoints: 4.5,
      indirectinviterpoints: 1.5,
    }],
    danmuList: [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }],
    sharetitle: "",
  },
  bvLoginShow: function (e) {
    this.setData({
      loginshow: true
    })
  },

  bvInputPhone(e) {
    this.data.inputphone= e.detail.value
  },

  bvSendCode: async function () {
    if (this.data.inputphone == '') {
      utils._ErrorToast("请输入手机号码")
    } else {
      if (this.data.disabledstatus == false) {
        this.setData({
          disabledstatus: true
        })
        this._SendCodeBtn()
        this.data.s_phonecode = await utils._sendcode(this.data.inputphone)
        console.log("验证码", this.data.s_phonecode)
      }else{
        utils._ErrorToast("已发送，请等待")
      }
    }
  },
  
  _SendCodeBtn() {
    var that = this;
    var currentTime = that.data.currentTime
    var interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabledstatus: false
        })
      }
    }, 1000)
  },

  bvPhoneCode(e) {
    this.data.u_phonecode= e.detail.value
  },

  bvLogin: async function (e) {
    if (this.data.u_phonecode == this.data.s_phonecode && this.data.u_phonecode != "") {
      this.setData({
        loginshow: false,
        loginbtnshow:false,
      })
      utils._NewMember(this.data.inputphone)
      utils._RegistPointsAdd()
      utils._SendNewUserSMS()
      app.globalData.Guserdata.UserInfo.UserPhone=this.data.inputphone
    }else {
      utils._ErrorToast("验证码错误")
    }
    console.log(app.globalData.Guserdata)
  },

  bvAddLike(e) {
    this.setData({
      buylikeshow: false
    })
  },
  bvBuyLike(e) {

    if (this.data.ordersublock == false && this.data.paymentsublock == false) {
      this.setData({
        discountlevel: e.currentTarget.dataset.level,
        discountid: e.currentTarget.dataset.id,
        discountname: e.currentTarget.dataset.name,
        discountstartdate: e.currentTarget.dataset.startdate,
        discountenddate: e.currentTarget.dataset.enddate,
        discounttotalfee: e.currentTarget.dataset.price,
        discounttype: e.currentTarget.dataset.type,
        // 生成订单号
        orderid: this._getGoodsRandomNumber(),
      })
      this._orderadd()
      this._paymentadd()
    } else {
      utils._ErrorToast("请勿重复提交")

    }


    this.setData({
      buylikeshow: true
    })
  },
  bvPointsSelect(e) {
    console.log(e.detail.cell)
    this.setData({
      totalfee: e.detail.cell.price,
      points: e.detail.cell.points
    })
  },
  // 点击支付按钮,发起支付
  bvBuyLike(event) {
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log("接收到的参数", options)

    if (options.userid) {
      // 有userid是通过分享进入
      console.log("if操作执行了")
      this.data.tempinviterid = options.userid,
        console.log("方法一如果参数以userid=格式存在，则显示接收到的参数", this.data.tempinviterid);

      // 调用方法初始化
      utils._setting()
      utils._productcheck()
      await utils._login()
      let data = await utils._usercheck(app.globalData.Guserid)
      console.log("data", data);
      if (data.length == 0) {
        await utils._newuser(this.data.tempinviterid, this.data.params, this.data.remark)
        await utils._invitercheck()
      } else {
        app.globalData.Guserdata = data[0]
        app.globalData.Gindirectinviterid = data[0].UserInfo.IndirectInviterId
        app.globalData.Ginviterid = data[0].UserInfo.InviterId
        app.globalData.Ginviterphone = data[0].UserInfo.InviterPhone
        console.log("当前用户信息", app.globalData.Guserdata);
        await utils._discountcheck()
      }

    }
    // 查询InfoShare
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "INFOSHARE",
        command: "and",
        where: [{
          InfoShareId: options.infoshareid,
          InfoStatus: 'checked'
        }]
      },
      success: res => {
        this.setData({
          infotitle: res.result.data[0].InfoTitle,
          infocontent: res.result.data[0].InfoContent,
          infovideo: res.result.data[0].VideoUrl,
          infoimages: res.result.data[0].ImagesUrl,
          likepoints: res.result.data[0].LikePoints,
          adddate: res.result.data[0].AddDate,
        })
        console.log("全部分享资讯", res)
      },
      fail: res => {
        console.log(res)
      }
    })

  },

  bindInputBlur(e) {
    this.inputValue = e.detail.value
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
      path: '/pages/promote/infoshare?userid=' + app.globalData.Guserid + '&infoshareid=' + this.data.infoshareid,
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