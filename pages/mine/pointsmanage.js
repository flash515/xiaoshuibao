const app = getApp()
const utils = require("../../utils/utils")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 登录框相关变量
    loginshow: false,
    loginbtnshow: false,
    time: "获取验证码",
    currentTime: 60,
    disabledstatus: false,
    inputphone:"",
    s_phonecode: "",
    u_phonecode: "",

    userid: "",
    tradebalance: 0,
    promotebalance: 0,
    transferpoints: 0,
    exchangepoints: 0,
    withdrawpoints: 0,
    packetnumber: 0,
    transferpacketid:"",
    balanceupdatetime: "",
    consumehistory: [],
    tradehistory: [],
    promotehistory: [],

    // 轮播参数
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
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
    if(this.data.inputphone=="998189" && this.data.u_phonecode=="981899"){
      // 使用测试账号登录
      this.setData({
        loginshow: false,
        loginbtnshow:false,
      })
      utils._NewMember(this.data.inputphone)
      app.globalData.Guserdata.UserInfo.UserPhone=this.data.inputphone
    }else{
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
  }
  },

  onHideMaskTap: function () {
    this.setData({
      loginshow: false
    })
  },
  bvTransferPoints(e) {
    this.setData({
      transferpoints: parseInt(e.detail.value),
    })
  },
  bvPacketNumber(e) {
    this.setData({
      packetnumber: parseInt(e.detail.value),
    })
  },

  bvExchangePoints(e) {
    this.setData({
      exchangepoints: parseInt(e.detail.value),
    })
  },

  bvTradePointsExchange: async function (e) {
    // 兑换前check一下balance
    this._balancecheck()
    const db = wx.cloud.database()
    db.collection("POINTS").add({
      data: {
        PointsType: "exchange",
        ProductName: "消费积分兑换",
        // 使用的消费积分
        ExchangeId: app.globalData.Guserid,
        ExchangePoints: this.data.exchangepoints,
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString('chinese', {
          hour12: false
        }),
        PointsStatus: "checked",
      },
      success: res => {
        utils._SuccessToast("积分兑换成功")
        this.setData({
          exchangepoints: 0,
        })
        // 兑换后更新一下balance
        this._balancecheck()
      },
      fail: res => {
        utils._ErrorToast("提交失败请重试")
      }
    })

  },
  bvTradePointsWithdraw: async function (e) {

  },

  bvReflash: async function (e) {

    if (new Date().getTime() < (new Date(this.data.balanceupdatetime).getTime() + 600000)) {
      utils._ErrorToast("间隔少于10分钟")
    } else {
      this._balancecheck()
    }
  },
  async _balancecheck() {
    let res = await utils._pointshistory()
    console.log("积分记录", res)
    this.setData({
      promotehistory: res[0],
      tradehistory: res[1],
    })
    // 积分求和

    let promotepoints = 0
    let tradepoints = 0

    if (res[0].length != 0) {
      for (let i = 0; i < res[0].length; i++) {
        if (res[0][i].RegistrantId == app.globalData.Guserid) {
          promotepoints = promotepoints + res[0][i].RegistrantPoints
        } else if (res[0][i].InviterId == app.globalData.Guserid) {
          promotepoints = promotepoints + res[0][i].InviterPoints
        } else if (res[0][i].IndirectInviterId == app.globalData.Guserid) {
          promotepoints = promotepoints + res[0][i].IndirectInviterPoints
        } else if (res[0][i].ConsumeId == app.globalData.Guserid) {
          promotepoints = promotepoints - res[0][i].ConsumePoints
        } else if (res[0][i].ExchangeId == app.globalData.Guserid) {
          promotepoints = promotepoints + res[0][i].ExchangePoints
        } else if (res[0][i].TransferId == app.globalData.Guserid) {
          promotepoints = promotepoints - res[0][i].TransferPoints
        }
      }
      console.log(promotepoints)
    }

    if (res[1].length != 0) {
      for (let i = 0; i < res[1].length; i++) {
        if (res[1][i].InviterId == app.globalData.Guserid) {
          tradepoints = tradepoints + res[1][i].InviterPoints
        } else if (res[1][i].IndirectInviterId == app.globalData.Guserid) {
          tradepoints = tradepoints + res[1][i].IndirectInviterPoints
        } else if (res[1][i].ExchangeId == app.globalData.Guserid) {
          tradepoints = tradepoints - res[1][i].ExchangePoints
        } else if (res[1][i].WithdrawId == app.globalData.Guserid) {
          tradepoints = tradepoints - res[1][i].WithdrawPoints
        }
      }
      console.log(tradepoints)

    }
    this.setData({
      promotebalance: promotepoints,
      tradebalance: tradepoints,
    })
    this.setData({
      balanceupdatetime: new Date().toLocaleString('chinese', {
        hour12: false
      })
    })
    utils._balanceupdate(this.data.promotebalance, this.data.tradebalance, this.data.balanceupdatetime)
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: async function (options) {
    this.setData({image:app.globalData.Gimagearray})
    if(app.globalData.Guserdata.UserInfo.UserPhone!=''){
      this.setData({
        loginbtnshow: false,
        userid: app.globalData.Guserid,
        promotebalance: app.globalData.Guserdata.TradeInfo.PromoteBalance,
        tradebalance: app.globalData.Guserdata.TradeInfo.TradeBalance,
        balanceupdatetime: app.globalData.Guserdata.TradeInfo.BalanceUpdateTime,
      })
    }else{
      this.setData({
        loginbtnshow: true
      })
    }

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  _transferpointsadd() {

    this.data.transferpacketid=utils._getGoodsRandomNumber()
    console.log(this.data.transferpacketid)
    var promise = new Promise((resolve, reject) => {
      const db = wx.cloud.database()
      db.collection("POINTS").add({
        data: {
          PointsType: "transfer",
          ProductName: "推广积分转让",
          // 使用的消费积分
          TransferPacketId:this.data.transferpacketid,
          TransferId: app.globalData.Guserid,
          TransferPoints: this.data.transferpoints,
          RemainPoints: this.data.transferpoints,
          PacketNumber: this.data.packetnumber,
          RemainPacket:this.data.packetnumber,
          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          PointsStatus: "checked",
        },
        success: res => {
          this.setData({
            transferpoints: 0,
            packetnumber: 0,
          })
          // 转让后更新一下balance
          this._balancecheck()
          resolve(res)
        },
        fail: res => {
          utils._ErrorToast("提交失败请重试")
        }
      })
    });
    return promise;
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: async function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res)
      await this._transferpointsadd()
      return {
        title: app.globalData.Guserdata.UserInfo.nickName + '送出的礼包！',
        path: '/pages/promote/pointspacket?userid=' + app.globalData.Guserid + "&transferpacketid="+this.data.transferpacketid,
        imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/%E7%A4%BC%E5%8C%85.png?sign=e79f00decafb4dc8fb227aa48443f5de&t=1679125766', //封面
        success: function (res) {
          // 转发成功之后的回调
          console.log(res)

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

    } else {
      return {
        title: app.globalData.Guserdata.UserInfo.nickName + '邀请您体验：',
        path: '/pages/index/index?userid=' + app.globalData.Guserid,
        imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/sharepic.png?sign=550a147f349dddb2a06196826020450d&t=1659681079', //封面
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
  }
})