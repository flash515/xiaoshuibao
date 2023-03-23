var utils = require("../../utils/utils")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempinviterid: "",
    params: "",
    userphone: "",
    useroldphone: "",
        //登录相关
    loginshow: true,
    time: "获取验证码",
    s_phonecode: "",
    u_phonecode: "",
    remark: "积分红包",
    transferpacketid: "",
    transferpoints: 0,
    packetnumber: 0,
    doneepoints: 0,
    remainpoints: 0,
    remainpacket: 0,
    temppoints: 0,
    temppacket: 0
  },
  bvUserPhone(e) {
    this.setData({
      userphone: e.detail.value
    })
  },
  _SendCodeBtn() {

    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)

  },
  bvSendCode() {
    if (this.data.userphone == "" || this.data.userphone == undefined) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'error',
        duration: 2000
      })
    } else {
      let _this = this;

      this.setData({
        disabled: true
      })
      wx.cloud.callFunction({
        name: 'sendmessage',
        data: {
          templateId: "985130",
          nocode: false,
          mobile: _this.data.userphone,
          nationcode: '86'
        },
        success: res => {
          let code = res.result.res.body.params[0];
          let result = res.errMsg;
          if (result == "cloud.callFunction:ok") {
            _this.setData({
              result: "发送成功",
              s_phonecode: code
            })
            this._SendCodeBtn()
          } else {
            _this.setData({
              result: "发送失败"
            })
          }
        },
        fail: err => {
          console.error('[云函数] [sendsms] 调用失败', err)
        }
      })
    }
  },
  bvPhoneCode(e) {
    this.setData({
      u_phonecode: e.detail.value
    })
  },
  bvLogin(e) {

    if (this.data.s_phonecode == this.data.u_phonecode && this.data.u_phonecode != "") {
      console.log('手机验证码正确')
      const db = wx.cloud.database()
      db.collection('USER').where({
        UserId: this.data.openid
      }).update({
        data: {
          ["UserInfo.UserPhone"]: this.data.userphone,
          ["UserInfo.UpdateDate"]: new Date().toLocaleString('chinese', {
            hour12: false
          })
        },
        success(res) {
          wx.showToast({
            title: '更新信息成功',
            icon: 'success',
            duration: 2000 //持续的时间
          })
        },
        fail(res) {
          wx.showToast({
            title: '更新信息失败',
            icon: 'error',
            duration: 2000 //持续的时间
          })
        }
      })
      // 根据用户是否已验证手机号，提供首次验证积分
      if (this.data.useroldphone == "") {
        // 成为会员时间
        const db = wx.cloud.database()
        db.collection('USER').where({
          UserId: this.data.openid
        }).update({
          data: {
            ["TradeInfo.MemberTime"]: new Date().toLocaleString('chinese', {
              hour12: false
            })
          },
          success(res) {

          },
        })
        console.log('推广积分')
        db.collection("POINTS").add({
          data: {
            PointsType: "promoter",
            RegistrantId: app.globalData.Guserid,
            RegistrantPoints: 50,
            ProductName: "会员手机认证",
            // 直接推荐人
            InviterId: app.globalData.Ginviterid,
            InviterPoints: 30,
            // 间接推荐人
            IndirectInviterId: app.globalData.Gindirectinviterid,
            IndirectInviterPoints: 10,
            SysAddDate: new Date().getTime(),
            AddDate: new Date().toLocaleString('chinese', {
              hour12: false
            }),
            PointsStatus: "checked",
          },
          success(res) {
            console.log("POINTS更新成功")
            //给推荐和和管理员发送短信
            if (app.globalData.Ginviterphone != undefined && app.globalData.Ginviterphone != "") {
              var tempmobile = [18954744612, app.globalData.Ginviterphone]
            } else {
              var tempmobile = [18954744612]
            }
            // 调用云函数发短信给推荐人和管理员
            wx.cloud.callFunction({
              name: 'sendsms',
              data: {
                templateId: "1569087",
                nocode: true,
                mobile: tempmobile
              },
              success: res => {
                console.log("短信发送结果", res)
              },
              fail: res => {
                console.log(res)
              },
            })
          },
        })

      }
    } else {
      wx.showToast({
        title: '验证码错误',
        icon: 'error',
        duration: 2000
      })

    }
  },
  _pointsupdate() {
    this.data.temppoints = this.data.remainpoints - this.data.doneepoints
    this.data.temppacket = this.data.remainpacket - 1
    console.log(this.data.temppoints, this.data.temppacket)
    const db = wx.cloud.database()
    db.collection("POINTS").where({
      TransferPacketId: this.data.transferpacketid
    }).update({
      data: {
        RemainPoints: this.data.temppoints,
        RemainPacket: this.data.temppacket,

      },
      success: res => {
        wx.showToast({
          title: '积分已领取入账',
          icon: 'error',
          duration: 2000 //持续的时间
        })

      },
      fail: res => {

      }
    })


    // wx.cloud.callFunction({
    //   name: 'NormalUpdate',
    //   data: {
    //     collectionName: 'POINTS',
    //     key: 'TransferPacketId',
    //     id: this.data.transferpacketid,
    //     key1: 'RemainPoints',
    //     key2: 'RemainPacket',
    //     value1: this.data.temppoints,
    //     value2: this.data.temppacket,
    //   },
    //   success: function (res) {
    //     console.log(res)
    //   },
    //   fail: function (res) {
    //     console.log(res)
    //   }
    // })
  },
  bvAccept() {
    const db = wx.cloud.database()
    db.collection("POINTS").add({
      data: {
        PointsType: "transfer",
        ProductName: "推广积分转让",
        // 使用的消费积分
        PacketId: this.data.transferpacketid,
        DoneeId: app.globalData.Guserid,
        DoneePoints: this.data.doneepoints,
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString('chinese', {
          hour12: false
        }),
        PointsStatus: "checked",
      },
      success: res => {
        wx.showToast({
          title: '积分已领取入账',
          icon: 'error',
          duration: 2000 //持续的时间
        })
        this._pointsupdate()
        //云函数更新礼包余额
      },
      fail: res => {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)

    this.setData({
      tempinviterid: options.userid,
      transferpacketid: options.transferpacketid,
      params: options,
    })

    // 调用方法初始化
    utils._setting()
    utils._productcheck()
    await utils._login()
    let data = await utils._usercheck()
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
    if (app.globalData.Guserdata.UserInfo.UserPhone != "") {
      this.setData({
        loginshow: false
      })
    }
    // 查询积分礼包
    let packet = await utils._packetcheck(this.data.transferpacketid)
    this.setData({
      remainpoints: packet[0],
      remainpacket: packet[1]
    })
    console.log(this.data.remainpoints, this.data.remainpacket)
    if (packet[1] == 0) {
      wx.showToast({
        title: '积分礼包已领完',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    } else if (packet[1] == 1) {
      this.setData({
        doneepoints: packet[0],
      })
    } else {
      this.setData({
        doneepoints: parseInt(Math.random() * packet[0])
      })
    }
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