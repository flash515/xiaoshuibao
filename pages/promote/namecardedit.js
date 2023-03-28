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
    cardshow: true,
    imageview: [],
    imageuploadlock: true,
    namecardbg: "",
    namecardbgarray: [],
    invitercompanyname: "",
    inviterusername: "",
    bankshow: "",
    bank: "",
    account: "",
    companylogo: [],
    companyname: "",
    companyid: "",
    businessscope: "",
    username: "",
    userphone: "",
    useroldphone: "",
    position: "",
    weichat: "",
    email: "",
    telephone: "",
    website: "",
    address: "",
    result: "未发送",
    balance: "",
    usertype: "",
    adddate: "",
    updatedate: "",

    logoview: [],
    logouploadlock: true,
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
  bvBank(e) {
    this.setData({
      bank: e.detail.value
    })
  },
  bvAccount(e) {
    this.setData({
      account: e.detail.value
    })
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
  bvPosition(e) {
    this.setData({
      position: e.detail.value
    })
  },
  bvWeiChat(e) {
    this.setData({
      weichat: e.detail.value
    })
  },
  bvEmail(e) {
    this.setData({
      email: e.detail.value
    })
  },
  bvTelephone(e) {
    this.setData({
      telephone: e.detail.value
    })
  },
  bvWebsite(e) {
    this.setData({
      website: e.detail.value
    })
  },
  bvAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  bvBgSelect(e) {
    console.log(e.detail.key)
    this.setData({
      namecardbg: e.detail.key
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
  bvChooseImage(e) {
    console.log(e.detail)
    this.setData({
      imageview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvRemoveImage(e) {
    this.setData({
      imageview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvUploadImage(e) {
    let that = this
    // 判断商品id是否空值
    if (this.data.companyname == "" || this.data.companyname == null) {
      wx.showToast({
        title: "企业名称不能为空",
        icon: 'none',
        duration: 2000
      })
    } else {
      // 判断是否重复提交
      if (this.data.imageuploadlock) {
        // 锁定时很执行
        wx.showToast({
          title: '请勿重复提交',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      } else {
        if (this.data.imageview.length == 0) {
          wx.showToast({
            title: '请先选取图片',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        } else {
          for (let i = 0; i < this.data.imageview.length; i++) {
            const filePath = this.data.imageview[i]
            const cloudPath = 'namecard/' + this.data.companyname + '/' + this.data.companyname + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log("fileID", res.fileID)
                this.data.imageview = this.data.imageview.concat(res.fileID)
                this.data.imageuploadlock = true // 修改上传状态为锁定

              }
            })
          }
        }

        // 异步上传，打印attachment时尚未返回数据
      }
    }
  },
  bvChooseLogo(e) {
    console.log(e.detail)
    // logo只有一个的情况不需要用数组
    this.setData({
      logoview: e.detail.all,
      logouploadlock: false
    })
  },
  bvRemoveLogo(e) {
    this.setData({
      logoview: e.detail.all,
      logouploadlock: false
    })
  },
  bvUploadLogo(e) {
    let that = this
    // 判断商品id是否空值
    if (this.data.companyname == "" || this.data.companyname == null) {
      wx.showToast({
        title: "企业名称不能为空",
        icon: 'none',
        duration: 2000
      })
    } else {
      // 判断是否重复提交
      if (this.data.logouploadlock) {
        // 锁定时很执行
        wx.showToast({
          title: '请勿重复提交',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      } else {
        if (this.data.logoview.length == 0) {
          wx.showToast({
            title: '请先选取图片',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        } else {
          for (let i = 0; i < this.data.logoview.length; i++) {
            const filePath = this.data.logoview[i]
            const cloudPath = 'namecard/' + this.data.companyname + filePath.match(/\.[^.]+?$/)
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log("fileID", res.fileID)
                // LOGO只有一个值的数组构建方式
                this.data.companylogo = [res.fileID]
                this.data.logouploadlock = true // 修改上传状态为锁定
                console.log("companylogo", this.data.companylogo)
              }
            })
          }
        }

        // 异步上传，打印attachment时尚未返回数据
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      namecardbgarray: app.globalData.Gsetting.namecardbg,
      namecardbg: app.globalData.Guserdata.UserInfo.NameCardBg,
      companylogo: app.globalData.Guserdata.UserInfo.CompanyLogo,
      logoview: app.globalData.Guserdata.UserInfo.CompanyLogo,
      companyname: app.globalData.Guserdata.UserInfo.CompanyName,
      companyid: app.globalData.Guserdata.UserInfo.CompanyId,
      businessscope: app.globalData.Guserdata.UserInfo.BusinessScope,
      address: app.globalData.Guserdata.UserInfo.Address,
      username: app.globalData.Guserdata.UserInfo.UserName,
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,
      useroldphone: app.globalData.Guserdata.UserInfo.UserPhone,
      position: app.globalData.Guserdata.UserInfo.Position,
      weichat: app.globalData.Guserdata.UserInfo.WeiChat,
      email: app.globalData.Guserdata.UserInfo.Email,
      website: app.globalData.Guserdata.UserInfo.Website,
      telephone: app.globalData.Guserdata.UserInfo.Telephone,
      imageview: app.globalData.Guserdata.UserInfo.ImageView,
      adddate: app.globalData.Guserdata.UserInfo.AddDate,
      updatedate: app.globalData.Guserdata.UserInfo.UpdateDate,
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

          namecardbg: res.data[0].UserInfo.NameCardBg,
          companylogo: res.data[0].UserInfo.CompanyLogo,
          logoview: res.data[0].UserInfo.CompanyLogo,
          companyname: res.data[0].UserInfo.CompanyName,
          companyid: res.data[0].UserInfo.CompanyId,
          businessscope: res.data[0].UserInfo.BusinessScope,
          address: res.data[0].UserInfo.Address,
          username: res.data[0].UserInfo.UserName,
          position: res.data[0].UserInfo.Position,
          weichat: res.data[0].UserInfo.WeiChat,
          email: res.data[0].UserInfo.Email,
          website: res.data[0].UserInfo.Website,
          telephone: res.data[0].UserInfo.Telephone,
          useroldphone: res.data[0].UserInfo.UserPhone,
          userphone: res.data[0].UserInfo.UserPhone,
          imageview: res.data[0].UserInfo.ImageView,
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
          ["UserInfo.UserName"]: this.data.username,
          ["UserInfo.Position"]: this.data.position,
          ["UserInfo.WeiChat"]: this.data.weichat,
          ["UserInfo.Email"]: this.data.email,
          ["UserInfo.Telephone"]: this.data.telephone,
          ["UserInfo.Website"]: this.data.website,
          ["UserInfo.UserPhone"]: this.data.userphone,
          ["UserInfo.CompanyLogo"]: this.data.companylogo,
          ["UserInfo.CompanyName"]: this.data.companyname,
          ["UserInfo.CompanyId"]: this.data.companyid,
          ["UserInfo.Address"]: this.data.address,
          ["UserInfo.BusinessScope"]: this.data.businessscope,
          ["UserInfo.NameCardBg"]: this.data.namecardbg,
          ["UserInfo.ImageView"]: this.data.imageview,
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
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.Guserdata.UserInfo.nickName + '推荐给您：',
      path: '/pages/promote/namecard?userid=' + app.globalData.Guserid,
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