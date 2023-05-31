const app = getApp()
const utils = require("../../utils/utils");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardinfo: [],
    cardbg: "", //名片背景
    cardbgarray: [], //系统背景
    imageview: [], //名片其他图片资料的临时文件
    cardimages: [], //名片其他图片资料
    companylogo: [],
    logoview: [], //选择logo时的临时文件
    companyname: "",
    businessscope: "",
    username: "",
    handphone: "",
    title: "",
    wechat: "",
    email: "",
    telephone: "",
    website: "",
    address: "",
    // 图片编辑

    bgcliperbtn:false,
    logocliperbtn:false,
    tempbg:"",
    templogo:"",
    bgedit: "", //剪裁背景临时路径
    logoedit: "", //剪裁背景临时路径
    bgtargetImageUrl:"", //裁剪后的临时路径
    logotargetImageUrl:"", //裁剪后的临时路径
    bgview:"", //自选背景的网络路径
    bgclipershow:false,
    logoclipershow:false,
    // 行业分类参数
    inputShow: false,
    boxShow: false,
    businesssortarray: [],
    category1: "",
    category1name: "",
    pIndex: 0,
    category2: "",
    category2name: "",
    cIndex: 0,
    category3: "",
    category3name: "",
    aIndex: 0,
    //关键词
    keywords: "",
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

  bvCompanyName(e) {
    this.setData({
      companyname: e.detail.value
    })
  },
  bvKeyWords(e) {
    this.setData({
      keywords: e.detail.value
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
  bvTitle(e) {
    this.setData({
      title: e.detail.value
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
    // 设定名片背景
    this.setData({
      cardbg: e.detail.key
    })
    console.log("cardbg", e.detail.key)
  },

  bvChooseBg(e) {
    // 选择自有背景,使用单个文件上传，返回字符型结果,注意current是数组
    console.log(e.detail.current)
    this.data.tempbg=e.detail.current[0]
    this.setData({
      srcbg:e.detail.current[0],
      bgcliperbtn:true,
    })
  },

  bvClipBg(){
    this.setData({
      bgclipershow:true,
      bgedit:this.data.tempbg
    })
  },
  
  linclip(e) {
    this.data.bgtargetImageUrl = e.detail.url;
    this.setData({
      srcbg:[e.detail.url]
    })
    console.log('生成的图片链接为：', this.data.bgtargetImageUrl);
  },

  async bvUploadBg() {
    let cloudpath1 = 'namecard/' + app.globalData.Guserdata.UserInfo.UserPhone + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'cardbg'
    var files1 = await utils._UploadFile(this.data.srcbg, cloudpath1)
    this.setData({
      bgview:files1,
      cardbg: files1,
    })
    console.log(this.data.cardbg)
  },

  bvRemoveBg(e) {
    console.log(e.detail.current)
    wx.cloud.deleteFile({
      fileList: [e.detail.current],
      success: res => {
        console.log(res)
        this.setData({
          cardbg: "",
          bgedit:"",
        })
      }
    })
  },
  bvDeleteBg(e) {
    wx.cloud.deleteFile({
      fileList: this.data.bgview,
      success: res => {
        console.log(res)
        this.setData({
          bgview:"",
          cardbg: "",
          bgedit:"",
        })
      }
    })
  },


  async bvChooseLogo(e) {
    console.log(e.detail.all)
    let cloudpath2 = 'namecard/' + app.globalData.Guserdata.UserInfo.UserPhone + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'companylogo'
    var files2 = await utils._UploadFiles(e.detail.all, cloudpath2)
    console.log(files2)
    this.setData({
      companylogo: files2
    })
  },

  bvRemoveLogo(e) {
    console.log("companylogo", e.detail.current)
    wx.cloud.deleteFile({
      fileList: this.data.companylogo,
      success: res => {
        this.setData({
          companylogo: [],
        })
        console.log("companylogo", this.data.companylogo)
      }
    })
  },

  async bvChooseImage(e) {
    console.log(e.detail.all)
    let cloudpath3 = 'namecard/' + app.globalData.Guserdata.UserInfo.UserPhone + '/' + app.globalData.Guserdata.UserInfo.UserPhone + 'cardimages'
    var files3 = await utils._UploadFiles(e.detail.all, cloudpath3)
    this.setData({
      cardimages:files3,
    })
  },

  bvRemoveImage(e) {
    console.log(e.detail.index)
    // 用一个指令即创建了fileList用于下一步删除，也改变了cardimages数组
    var fileList = this.data.cardimages.splice(e.detail.index, 1)
    this.setData({
      cardimages: this.data.cardimages
    })
    console.log("cardimages", this.data.cardimages)
    console.log(fileList)
    wx.cloud.deleteFile({
      fileList,
      success: res => {
        console.log("res", res)
      }
    })

  },

  //发布到企业广场
  async bvPublish(e) {
    let that=this
    await this.bvSaveNameCard()
    if (this.data.username == '') {
      utils._ErrorToast("请填写姓名")
      return
    }
    if (this.data.handphone == '' && this.data.telephone == '') {
      utils._ErrorToast("缺少手机或电话")
      return
    }
    if (this.data.category1 == '' && this.data.category2 == '' && this.data.category3 == '' ) {
      utils._ErrorToast("缺少行业分类")
      return
    }
    if (this.data.keywords == '') {
      utils._ErrorToast("缺少搜索关键词")
      return
    }
    if (app.globalData.Guserdata.NameCardStatus == undefined) {
      // 首次发布新增记录
      const db = wx.cloud.database()
      db.collection('NAMECARD').add({
        data: {
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          CardBg: this.data.cardbg,
          CompanyLogo: this.data.companylogo,
          CardImages: this.data.cardimages,
          UserName: this.data.username,
          Title: this.data.title,
          WeChat: this.data.wechat,
          Email: this.data.email,
          Telephone: this.data.telephone,
          Website: this.data.website,
          HandPhone: this.data.handphone,
          CompanyName: this.data.companyname,
          Address: this.data.address,
          BusinessScope: this.data.businessscope,
          KeyWords: this.data.keywords,
          Category1: this.data.category1,
          Category2: this.data.category2,
          Category3: this.data.category3,
          View: 0,
          CreatorId: app.globalData.Guserid
        },
        success: res => {
          this.data.publishstatus = true
          db.collection('USER').where({
            UserId: app.globalData.Guserid
          }).update({
            data: {
              ["NameCardStatus"]: "Published",
            },
            success: res => {
              utils._SuccessToast("名片发布成功")
              wx.redirectTo({
                url: "../promote/namecard?creatorid="+app.globalData.Guserid
              })
            },
          })

        },
      })
    } else {
      // 再次发布是更新
      const db = wx.cloud.database()
      db.collection('NAMECARD').where({
        CreatorId: app.globalData.Guserid
      }).update({
        data: {
          PublishDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          CardBg: this.data.cardbg,
          CompanyLogo: this.data.companylogo,
          CardImages: this.data.cardimages,
          UserName: this.data.username,
          Title: this.data.title,
          WeChat: this.data.wechat,
          Email: this.data.email,
          Telephone: this.data.telephone,
          Website: this.data.website,
          HandPhone: this.data.handphone,
          CompanyName: this.data.companyname,
          Address: this.data.address,
          BusinessScope: this.data.businessscope,
          KeyWords: this.data.keywords,
          Category1: this.data.category1,
          Category2: this.data.category2,
          Category3: this.data.category3,
        },
        success: res => {
          utils._SuccessToast("名片发布成功")
        },
      })
    }
  },

  //保存名片信息
  async bvSaveNameCard(e) {
    console.log("保存执行了")
    this.data.cardinfo = {
      ["CardBg"]: this.data.cardbg,
      ["CompanyLogo"]: this.data.companylogo,
      ["CardImages"]: this.data.cardimages,
      ["UserName"]: this.data.username,
      ["Title"]: this.data.title,
      ["WeChat"]: this.data.wechat,
      ["Email"]: this.data.email,
      ["Telephone"]: this.data.telephone,
      ["Website"]: this.data.website,
      ["HandPhone"]: this.data.handphone,
      ["CompanyName"]: this.data.companyname,
      ["Address"]: this.data.address,
      ["BusinessScope"]: this.data.businessscope,
      ["KeyWords"]: this.data.keywords,
      ["Category1"]: this.data.category1,
      ["Category2"]: this.data.category2,
      ["Category3"]: this.data.category3,
      ["UpdateDate"]: new Date().toLocaleString('chinese', {
        hour12: false
      })
    }
    wx.setStorageSync("NameCard", this.data.cardinfo)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const db = wx.cloud.database()
    db.collection('NameCardSetting').doc('0122a5876443793e098bd33e0045f553').get({
      success: res => {
        this.setData({
          cardbgarray: res.data.NameCardBg,
          businesssortarray: res.data.BusinessSortArray
        })
        console.log("行业类别更新成功")
      }
    })
    wx.getStorage({
      key: 'NameCard',
      success: res => {
        this.setData({
          cardbg: res.data.CardBg,
          companylogo: res.data.CompanyLogo,
          cardimages: res.data.CardImages,
          companyname: res.data.CompanyName,
          username: res.data.UserName,
          handphone: res.data.HandPhone,
          title: res.data.Title,
          wechat: res.data.WeChat,
          email: res.data.Email,
          website: res.data.Website,
          telephone: res.data.Telephone,
          businessscope: res.data.BusinessScope,
          address: res.data.Address,
          updatedate: res.data.UpdateDate,
          category1: res.data.Category1,
          category2: res.data.Category2,
          category3: res.data.Category3,
          keywords: res.data.KeyWords,
        })
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

})