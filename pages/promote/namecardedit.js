const app = getApp()
const utils = require("../../utils/utils");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardbg: "", //名片背景
    cardbgarray: [], //系统背景
    bgview: "", //自选背景时的临时文件
    imageview: [], //名片其他图片资料的临时文件
    cardimages: [], //名片其他图片资料
    invitercompanyname: "",
    inviterusername: "",
    companylogo: [],
    logoview: [], //选择logo时的临时文件
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

    // 商品分类参数
    inputShow: false,
    boxShow: false,
    businesssortarray:[],
    category1: "",
    category1name: "",
    pIndex: 0,
    category2: "",
    category2name: "",
    cIndex: 0,
    category3: "",
    category3name: "",
    aIndex: 0,

    keywords: [],
    companysort: [],
    updatedate: "",
    logouploadlock: true,
  },
    // 展示弹框
    getbox: function () {
      this.setData({
        boxShow: true,
        inputShow: true
      })
    },
    // 隐藏弹框
    hidebox: function () {
      this.setData({
        boxShow: false,
        inputShow: false
      })
    },
    // 确认按钮
    confirm: function () {
      this.setData({
        category1: this.data.category1name,
        category2: this.data.category2name,
        category3: this.data.category3name,
        boxShow: false,
        inputShow: false,
      })
  
    },
    changeCategory1: function (e) {
      const val = e.detail.value
      this.setData({
        pIndex: val,
        cIndex: 0,
        aIndex: 0,
        category1name: this.data.businesssortarray[val].Category1Name,
        category2name: this.data.businesssortarray[val].Category2Array[0].Category2Name,
        category3name: this.data.businesssortarray[val].Category2Array[0].Category3Array[0].Category3Name,
      })
    },
    changeCategory2: function (e) {
      const val = e.detail.value
      this.setData({
        cIndex: val,
        aIndex: 0,
        category2name: this.data.businesssortarray[this.data.pIndex].Category2Array[val].Category2Name,
        category3name: this.data.businesssortarray[this.data.pIndex].Category2Array[val].Category3Array[0].Category3Name,
  
      })
    },
    changeCategory3: function (e) {
      const val = e.detail.value
      this.setData({
        aIndex: val,
        category3name: this.data.businesssortarray[this.data.pIndex].Category2Array[this.data.cIndex].Category3Array[val].Category3Name,
      })
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
  bvChooseBg(e) {
    console.log(e.detail)
    this.setData({
      bgview: e.detail.all,
    })
    // const filePath = this.data.bgview[0]
    // const cloudPath = 'namecard/' + app.globalData.Guserid + '/cardbg' + filePath.match(/\.[^.]+?$/)
    // wx.cloud.uploadFile({
    //   cloudPath,
    //   filePath,
    //   success: res => {
    //     // LOGO只有一个值的数组构建方式
    //     this.setData({
    //       cardbg: [res.fileID],
    //     })
    //     console.log("cardbg", this.data.cardbg)
    //   }
    // })

  },
  bvRemoveBg(e) {
    wx.cloud.deleteFile({
      fileList: this.data.cardbg,
      success: res => {
        this.setData({
          bgview: [],
          cardbg: [],
        })
        console.log("cardbg", this.data.cardbg)
      }
    })
  },

  bvChooseImage(e) {
    console.log(e.detail)
    this.setData({
      imageview: e.detail.all,
    })

  },

  bvRemoveImage(e) {
    var fileList = [e.detail.current]
    wx.cloud.deleteFile({
      fileList,
      success: res => {
        this.setData({
          imageview: this.data.imageview.splice(e.detail.index, 1),
          cardimages: this.data.imageview.splice(e.detail.index, 1),
        })
        console.log("cardimages", this.data.cardimages)
      }
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
    this.setData({
      logoview: e.detail.all,
      // logouploadlock: false
    })
    // for (let i = 0; i < this.data.logoview.length; i++) {
    //   const filePath = this.data.logoview[i]
    //   const cloudPath = 'namecard/' + app.globalData.Guserid + '/companylogo' + filePath.match(/\.[^.]+?$/)
    //   wx.cloud.uploadFile({
    //     cloudPath,
    //     filePath,
    //     success: res => {
    //       console.log("fileID", res.fileID)
    //       // LOGO只有一个值的数组构建方式
    //       this.setData({
    //         companylogo: [res.fileID],
    //       })
    //       console.log("companylogo", this.data.companylogo)
    //     }
    //   })
    // }
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


  bvView: function (e) {
    wx.redirectTo({
      url: "../promote/namecard"
    })
  },
  //保存名片信息
  async bvUpdate(e) {
    let cloudpath = 'namecard/' + app.globalData.Guserid + '/cardbg'
    let files1=await utils._UploadFiles(this.data.bgview,cloudpath)
  cloudpath = 'namecard/' + app.globalData.Guserid + '/companylogo'
    let files2=await utils._UploadFiles(this.data.logoview,cloudpath)
  cloudpath = 'namecard/' + app.globalData.Guserid + '/cardimages'
    let files3=await utils._UploadFiles(this.data.imageview,cloudpath)
  console.log(files1,files2,files3)
    },


  //保存名片信息
 async bvSave(e) {
  let cloudpath = 'namecard/' + app.globalData.Guserid + '/cardbg'
  let files1=await utils._UploadFiles(this.data.bgview,cloudpath)
cloudpath = 'namecard/' + app.globalData.Guserid + '/companylogo'
  let files2=await utils._UploadFiles(this.data.logoview,cloudpath)
cloudpath = 'namecard/' + app.globalData.Guserid + '/cardimages'
  let files3=await utils._UploadFiles(this.data.imageview,cloudpath)
console.log(files1,files2,files3)

    var cardinfo = {
      ["CardBg"]: files1,
      ["CompanyLogo"]: files2,
      ["CardImages"]: files3,
      ["UserName"]: this.data.username,
      ["Position"]: this.data.position,
      ["WeChat"]: this.data.wechat,
      ["Email"]: this.data.email,
      ["Telephone"]: this.data.telephone,
      ["Website"]: this.data.website,
      ["HandPhone"]: this.data.handphone,
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
      businesssortarray:app.globalData.Gsetting.BusinessSort
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
        keywords: app.globalData.Guserdata.NameCard.KeyWords,
        companysort: app.globalData.Guserdata.NameCard.CompanySort,
        address: app.globalData.Guserdata.NameCard.Address,
        updatedate: app.globalData.Guserdata.NameCard.UpdateDate,
        bgview: app.globalData.Guserdata.NameCard.CardBg,
        logoview: app.globalData.Guserdata.NameCard.CompanyLogo,
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