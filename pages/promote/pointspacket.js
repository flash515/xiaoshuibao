var utils = require("../../utils/utils")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempinviterid: "",
    params: "",
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