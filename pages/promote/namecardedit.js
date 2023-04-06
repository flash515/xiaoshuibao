const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
const utils = require("../../utils/utils");
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
    namecardimages: [],
    invitercompanyname: "",
    inviterusername: "",
    companylogo: [],
    companyname: "",
    companyid: "",
    businessscope: "",
    username: "",
    userphone: "",
    useroldphone: "",
    position: "",
    wechat: "",
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
  bvWeChat(e) {
    this.setData({
      wechat: e.detail.value
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
  async bvUploadImage(e) {
    let that = this
    // 判断商品id是否空值
    if (this.data.companyname == "" || this.data.companyname == null) {
      utils._ErrorToast("企业名称不能空")
    } else {
      // 判断是否重复提交
      if (this.data.imageuploadlock) {
        // 锁定时很执行
        utils._ErrorToast("请勿重复提交")
      } else {
        if (this.data.imageview.length == 0) {
          utils._ErrorToast("请先选取图片")
        } else {
          // for循环里等待异步执行结果的方法，重要内容
          var cloudpath = 'namecard/' + this.data.companyname
          let that = this
          var tempfiles = []
          for (let i = 0; i < that.data.imageview.length; ++i) {
            tempfiles = tempfiles.concat(new Promise((resolve, reject) => {
              const filePath = that.data.imageview[i]
              const cloudPath = cloudpath + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
              wx.cloud.uploadFile({
                cloudPath,
                filePath,
                success: res => {
                  console.log('res', res.fileID)
                  resolve(res.fileID)
                }
              })
            }))
          }
          Promise.all(tempfiles).then(res => {
            console.log(res)
            this.setData({
              namecardimages: res,
              imageuploadlock: true // 修改上传状态为锁定})
            })
          }, err => {
            console.log(err)
          })

        }
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
      utils._ErrorToast("企业名称不能空")
    } else {
      // 判断是否重复提交
      if (this.data.logouploadlock) {
        // 锁定时很执行
        utils._ErrorToast("请勿重复提交")
      } else {
        if (this.data.logoview.length == 0) {
          utils._ErrorToast("请先选取图片")
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
                this.setData({
                  companylogo: [res.fileID],
                  logouploadlock: true,
                })
                // this.data.companylogo = [res.fileID]
                // this.data.logouploadlock = true // 修改上传状态为锁定
                console.log("companylogo", this.data.companylogo)
              }
            })
          }
        }

        // 异步上传，打印attachment时尚未返回数据
      }
    }
  },
  bvEdit: function (e) {
    if (app.globalData.Guserdata.UserInfo.UserPhone == '' || app.globalData.Guserdata.UserInfo.UserPhone == undefined) {
      this.setData({
        loginshow: true
      })
    } else {
      this.setData({
        cardshow: false
      })
    }
  },
  bvView: function (e) {
    this.setData({
      cardshow: true
    })

  },
  bvUserPhone(e) {
    this.setData({
      userphone: e.detail.value
    })
  },
  bvPhoneCode(e) {
    this.setData({
      u_phonecode: e.detail.value
    })
  },
  bvSendCode: async function () {
    this.data.s_phonecode = await utils._sendcode(this.data.userphone)
    console.log("验证码", this.data.s_phonecode)
    if (this.data.s_phonecode != '' && this.data.s_phonecode != undefined) {
      this._SendCodeBtn()
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
          disabled: false
        })
      }
    }, 1000)

  },
  bvLogin: async function (e) {
    await utils._UserLogin(this.data.userphone, this.data.s_phonecode, this.data.u_phonecode)
    await utils._RegistPointsAdd()
    await utils._SendNewUserSMS()
    this.setData({
      loginshow: false,
      loginbtnshow: false
    })
    app.globalData.Guserdata.UserInfo.UserPhone = this.data.userphone
    console.log(app.globalData.Guserdata)
  },
  onHideMaskTap: function () {
    this.setData({
      loginshow: false
    })
  },
  //修改数据操作
  bvPublish(e) {
    if (this.data.publishstatus == false) {
      const db = wx.cloud.database()
      db.collection('NAMECARD').add({
        data: {
          UserId: app.globalData.Guserid,
          UserName: this.data.username,
          Position: this.data.position,
          WeChat: this.data.wechat,
          Email: this.data.email,
          Telephone: this.data.telephone,
          Website: this.data.website,
          UserPhone: this.data.userphone,
          CompanyLogo: this.data.companylogo,
          CompanyName: this.data.companyname,
          CompanyId: this.data.companyid,
          Address: this.data.address,
          BusinessScope: this.data.businessscope,
          BusinessSort: this.data.businesssort,
          KeyWords: this.data.keywords,
          NameCardBg: this.data.namecardbg,
          NameCardImages: this.data.namecardimages,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          })
        },
        success(res) {
          utils._SuccessToast("名片发布成功")
          this.data.publishstatus = true
          db.collection('USER').where({
            UserId: app.globalData.Guserid
          }).update({
            data: {
              ["UserInfo.NameCarePublishStatus"]: this.data.publishstatus,
            },
            success(res) {
              utils._SuccessToast("名片发布成功")
            },
            fail(res) {
              utils._ErrorToast("名片发布不成功")
            }
          })
        },
        fail(res) {
          utils._ErrorToast("名片发布不成功")
        }
      })
    } else {
      const db = wx.cloud.database()
      db.collection('NAMECARD').where({
        UserId: app.globalData.Guserid
      }).update({
        data: {
          UserName: this.data.username,
          Position: this.data.position,
          WeChat: this.data.wechat,
          Email: this.data.email,
          Telephone: this.data.telephone,
          Website: this.data.website,
          UserPhone: this.data.userphone,
          CompanyLogo: this.data.companylogo,
          CompanyName: this.data.companyname,
          CompanyId: this.data.companyid,
          Address: this.data.address,
          BusinessScope: this.data.businessscope,
          BusinessSort: this.data.businesssort,
          KeyWords: this.data.keywords,
          NameCardBg: this.data.namecardbg,
          NameCardImages: this.data.namecardimages,
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          })
        },
        success(res) {
          utils._SuccessToast("名片发布成功")
        },
        fail(res) {
          utils._ErrorToast("名片发布不成功")
        }
      })
    }


  },
  //修改数据操作
  bvUpdate(e) {
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        ["UserInfo.UserName"]: this.data.username,
        ["UserInfo.Position"]: this.data.position,
        ["UserInfo.WeChat"]: this.data.wechat,
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
        ["UserInfo.NameCardImages"]: this.data.namecardimages,
        ["UserInfo.UpdateDate"]: new Date().toLocaleString('chinese', {
          hour12: false
        })
      },
      success(res) {
        app.globalData.Guserdata.UserInfo.UserName = this.data.username,
          app.globalData.Guserdata.UserInfo.Position = this.data.position,
          app.globalData.Guserdata.UserInfo.WeChat = this.data.wechat,
          app.globalData.Guserdata.UserInfo.Email = this.data.email,
          app.globalData.Guserdata.UserInfo.Telephone = this.data.telephone,
          app.globalData.Guserdata.UserInfo.Website = this.data.website,
          app.globalData.Guserdata.UserInfo.UserPhone = this.data.userphone,
          app.globalData.Guserdata.UserInfo.CompanyLogo = this.data.companylogo,
          app.globalData.Guserdata.UserInfo.CompanyName = this.data.companyname,
          app.globalData.Guserdata.UserInfo.CompanyId = this.data.companyid,
          app.globalData.Guserdata.UserInfo.Address = this.data.address,
          app.globalData.Guserdata.UserInfo.BusinessScope = this.data.businessscope,
          app.globalData.Guserdata.UserInfo.NameCardBg = this.data.namecardbg,
          app.globalData.Guserdata.UserInfo.NameCardImages = this.data.namecardimages,

          utils._SuccessToast("名片保存成功")
      },
      fail(res) {
        utils._ErrorToast("名片保存不成功")
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      publishstatus: app.globalData.Guserdata.UserInfo.NameCardPublishStatus,
      namecardbgarray: app.globalData.Gsetting.namecardbg,
      namecardbg: app.globalData.Guserdata.UserInfo.NameCardBg,
      namecardimages: app.globalData.Guserdata.UserInfo.NameCardImages,
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
      wechat: app.globalData.Guserdata.UserInfo.WeChat,
      email: app.globalData.Guserdata.UserInfo.Email,
      website: app.globalData.Guserdata.UserInfo.Website,
      telephone: app.globalData.Guserdata.UserInfo.Telephone,
      imageview: app.globalData.Guserdata.UserInfo.NameCardImages,
      adddate: app.globalData.Guserdata.UserInfo.AddDate,
      updatedate: app.globalData.Guserdata.UserInfo.UpdateDate,
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
  onShareAppMessage: function (res) {
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