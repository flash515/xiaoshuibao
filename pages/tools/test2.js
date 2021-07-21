// pages/tools/test2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result: "未发送"
  },
  getPhone: function(e) {

    let phone = e.detail.value;

    this.setData({

        phone

    })

},
getSms: function(e) {

  let sms = e.detail.value;

  this.setData({

      u_sms: sms

  })

},
check: function() {

  let s_sms = this.data.s_sms;

  let u_sms = this.data.u_sms;

  if (s_sms == u_sms) {

      wx.showToast({

          title: '验证成功',

          icon: 'success',

          duration: 2000

      })

  } else {

      wx.showToast({

          title: '验证码输入错误',

          icon: 'none',

          duration: 2000

      })

  }

},
send: function() {

  let _this = this;

  wx.cloud.callFunction({

      name: 'sendsms',

      data: {

          mobile: _this.data.phone,

          nationcode: '86'

      },

      success: res => {

          let sms = res.result.res.body.params[0];

          let result = res.errMsg;

          if (result == "cloud.callFunction:ok") {

              _this.setData({

                  result: "发送成功",

                  s_sms: sms

              })

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

},



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database()
    const $ = db.command.or
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "DKORDER",
        command: "or",
        where: [{
          PaymentStatus: "unchecked"
        }, {
          OrderStatus: "unchecked"
        }]

      },
      success: res => {
        this.setData({
          dkorderuncheckarray: res.data
        })
      }
    })
  },
  onSendSMS() {
    let that = this
    wx.cloud.callFunction({
      name: "sendsms",
      data: {
        data: {
          mobile: "13025400559",
          nationcode: "0086"
        },
      },
      success: res => {
        console.log(res)
        let sms = res.result.res.body.params[0];
        let result = res.errMsg;
        if (result == "cloud.callFunction:ok") {
          that.setData({
            result: "发送成功",
            s_sms: sms
          })

        } else {
          that.setData({
            result: "发送失败"
          })
        }
      },
      fail: err => {
        console.error('[云函数] [sendsms] 调用失败', err)
      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})