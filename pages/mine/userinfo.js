const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarurl: defaultAvatarUrl,
    nickname: "",
    time: "获取验证码",
    currentTime: 60,
    disabled: false,
    s_phonecode: "",
    u_phonecode: "",
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
    invitercompanyname: "",
    inviterusername: "",
    companyname: "",
    companyid: "",
    businessscope: "",
    companyscale: "",
    username: "",
    userphone: "",
    useroldphone: "",
    result: "未发送",
    balance: "",
    usertype: "",
    adddate: "",
    updatedate: ""
  },
  onChooseAvatar(e) {
    // const {
    //   avatarUrl
    // } = e.detail
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
  changeTabs(e) {
    console.log(e.detail)
    if (e.detail.activeKey == "three") {
      this.setData({
        btnhidden: true
      })
    } else {
      this.setData({
        btnhidden: false
      })
    }
  },
  bvCompanyName(e) {
    this.setData({
      companyname: e.detail.value
    })
  },
  bvCompanyId(e) {
    this.setData({
      companyid: e.detail.value
    })
  },
  bvBusinessScope(e) {
    this.setData({
      businessscope: e.detail.value
    })
  },
  bvCompanyScale(e) {
    this.setData({
      companyscale: e.detail.value
    })
  },
  bvUserName(e) {
    this.setData({
      username: e.detail.value
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickname: app.globalData.Guserdata.UserInfo.nickName,
      companyname: app.globalData.Guserdata.UserInfo.CompanyName,
      companyid: app.globalData.Guserdata.UserInfo.CompanyId,
      businessscope: app.globalData.Guserdata.UserInfo.BusinessScope,
      companyscale: app.globalData.Guserdata.UserInfo.CompanyScale,
      username: app.globalData.Guserdata.UserInfo.UserName,
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,
      useroldphone: app.globalData.Guserdata.UserInfo.UserPhone,
      usertype: app.globalData.Guserdata.TradeInfo.UserType,
      adddate: app.globalData.Guserdata.UserInfo.AddDate,
      updatedate: app.globalData.Guserdata.UserInfo.UpdateDate,
      invitercompany: app.globalData.Guserdata.UserInfo.InviterCompany,
      invitername: app.globalData.Guserdata.UserInfo.InviterName,
    })

  },
  // 刷新信息
  RefreshData() {
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).get({
      success: res => {
        this.setData({
          avatarurl: app.globalData.Guserdata.UserInfo.avatarUrl,
          nickname: app.globalData.Guserdata.UserInfo.nickName,
          companyname: res.data[0].UserInfo.CompanyName,
          companyid: res.data[0].UserInfo.CompanyId,
          businessscope: res.data[0].UserInfo.BusinessScope,
          companyscale: res.data[0].UserInfo.CompanyScale,
          username: res.data[0].UserInfo.UserName,
          useroldphone: res.data[0].UserInfo.UserPhone,
          userphone: res.data[0].UserInfo.UserPhone,
          usertype: res.data[0].TradeInfo.UserType,
          updatedate: res.data[0].UserInfo.UpdateDate,
        })
      }
    })
  },

  //修改数据操作
  UpdateData(e) {

    if (this.data.s_phonecode == this.data.u_phonecode && this.data.u_phonecode != "") {
      console.log('手机验证码正确')
      const db = wx.cloud.database()
      db.collection('USER').where({
        UserId: this.data.openid
      }).update({
        data: {
          ["UserInfo.CompanyName"]: this.data.companyname,
          ["UserInfo.CompanyId"]: this.data.companyid,
          ["UserInfo.CompanyScale"]: this.data.companyscale,
          ["UserInfo.BusinessScope"]: this.data.businessscope,
          ["UserInfo.UserName"]: this.data.username,
          ["UserInfo.UserPhone"]: this.data.userphone,
          ["UserInfo.avatarUrl"]: this.data.avatarurl,
          ["UserInfo.nickName"]: this.data.nickname,
          ["UserInfo.UpdateDate"]: new Date().toLocaleString('chinese',{ hour12: false })
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
        console.log('加积分')
        const db = wx.cloud.database()
        db.collection("POINTS").add({
          data: {
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
            AddDate: new Date().toLocaleString('chinese',{ hour12: false }),
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