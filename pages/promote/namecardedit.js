const app = getApp()
const utils = require("../../utils/utils");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardbg: "",//名片背景
    cardbgarray: [],//系统背景
    bgview:"",//自选背景时的临时文件

    imageview: [],//名片其他图片资料的临时文件
    imageuploadlock: true,//其他图片上传锁定
    cardimages: [],//名片其他图片资料
    invitercompanyname: "",
    inviterusername: "",
    companylogo: [],
    logoview:[],//选择logo时的临时文件
    companyname: "",
    businessscope: "",
    username: "",
    handphone: "",
    position: "",
    wechat: "",
    email: "",
    telephone: "",
    website: "",
    address: "",
    keywords: [],
    companysort: [],
    updatedate: "",
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
  bvHandPhone(e) {
    this.setData({
      handphone: e.detail.value
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
      cardbg: e.detail.key
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
              cardimages: res,
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
      // logouploadlock: false
    })
    for (let i = 0; i < this.data.logoview.length; i++) {
      const filePath = this.data.logoview[i]
      const cloudPath = 'namecard/' +app.globalData.Guserid+ '/companylogo' + filePath.match(/\.[^.]+?$/)
      wx.cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          console.log("fileID", res.fileID)
          // LOGO只有一个值的数组构建方式
          this.setData({
            companylogo: [res.fileID],
          })
          console.log("companylogo", this.data.companylogo)
        }
      })
    }
  },
  bvRemoveLogo(e) {
    wx.cloud.deleteFile({
      fileList: this.data.companylogo,
      success: res => {
        console.log("companylogo", res.fileList)
        this.setData({
          companylogo: [],
          logoview: [],
        })
        console.log("companylogo", this.data.companylogo)
      }
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
            const cloudPath = 'namecard/' +app.globalData.Guserid+ '/companylogo' + filePath.match(/\.[^.]+?$/)
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

  bvView: function (e) {
    wx.redirectTo({
      url: "../promote/namecard"
    })
  },

  //保存名片信息
  bvSave(e) {
    var cardinfo = {
      ["CardBg"]: this.data.cardbg,
      ["CardImages"]: this.data.cardimages,
      ["UserName"]: this.data.username,
      ["Position"]: this.data.position,
      ["WeChat"]: this.data.wechat,
      ["Email"]: this.data.email,
      ["Telephone"]: this.data.telephone,
      ["Website"]: this.data.website,
      ["HandPhone"]: this.data.handphone,
      ["CompanyLogo"]: this.data.companylogo,
      ["CompanyName"]: this.data.companyname,
      ["Address"]: this.data.address,
      ["KeyWords"]: this.data.keywords,
      ["CompanySort"]: this.data.companysort,
      ["BusinessScope"]: this.data.businessscope,
    }
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        NameCard: cardinfo,
        ["UserInfo.UpdateDate"]: new Date().toLocaleString('chinese', {
          hour12: false
        })
      },
      success: res => {
        app.globalData.Guserdata.NameCard = cardinfo,
          utils._SuccessToast("名片保存成功")
      },
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cardbgarray: app.globalData.Gsetting.namecardbg,
    })
    if (app.globalData.Guserdata.NameCard != undefined) {
    this.setData({
      cardbg: app.globalData.Guserdata.NameCard.CardBg,
      companylogo: app.globalData.Guserdata.NameCard.CompanyLogo,
      companyname: app.globalData.Guserdata.NameCard.CompanyName,
      username: app.globalData.Guserdata.NameCard.UserName,
      handphone: app.globalData.Guserdata.NameCard.HandPhone,
      position: app.globalData.Guserdata.NameCard.Position,
      wechat: app.globalData.Guserdata.NameCard.WeChat,
      email: app.globalData.Guserdata.NameCard.Email,
      website: app.globalData.Guserdata.NameCard.Website,
      telephone: app.globalData.Guserdata.NameCard.Telephone,
      businessscope: app.globalData.Guserdata.NameCard.BusinessScope,
      keywords:app.globalData.Guserdata.NameCard.KeyWords,
      companysort:app.globalData.Guserdata.NameCard.CompanySort,
      address: app.globalData.Guserdata.NameCard.Address,
      updatedate: app.globalData.Guserdata.NameCard.UpdateDate,
      bgview: app.globalData.Guserdata.NameCard.CardBg,
      logoview:app.globalData.Guserdata.NameCard.CompanyLogo,
      imageview: app.globalData.Guserdata.NameCard.CardImages,
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