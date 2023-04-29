const app = getApp()
const utils = require("../../utils/utils");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 初始化相关
    params: {},
    tempinviterid: "",
    remark: "",
    // 登录框参数
    loginshow: false,
    time: "获取验证码",
    currentTime: 60,
    disabledstatus: false,
    s_phonecode: "",
    u_phonecode: "",
    inputphone: "",
    // 名片参数
    type: "",
    cardinfo: [],
    sample: {
      CardBg: "https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/namecard/bg4.jpg?sign=d6efb4092f3b166f2dd79649a46f19a0&t=1682499042",
      CardImages: [],
      CompanyLogo: "https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/oo7kw5rohI15ogf6TCX_SGAxYUao/%E5%B8%A6unionid%E5%8F%82%E6%95%B0%E9%80%8F%E6%98%8E.png?sign=a2fe221407105d1394df92016c9ab7b4&t=1682498686",
      CompanyName: "小税宝有限公司（样版）",
      BusinessScope: "  小税宝有限公司成立于2021年，专注于收集和整理各地税务优惠政策、财政奖励政策，并为企业提供企业托管、财税相关服务。",
      UserName: "小税宝",
      Title: "产品经理",
      HandPhone: "123456",
      WeChat: "123456",
      Email: "123456@163.com",
      Telephone: "0755-12345678",
      Website: "www.123456.com",
      Address: "广东省深圳市南山区粤海街道",
    },
    adddate: "",
    updatedate: ""
  },

  onLogin(e) {
    this.setData({
      loginshow: e.detail.loginshow,
      userphone: e.detail.userphone,
    })
    wx.redirectTo({
      url: "../promote/namecardedit"
    })
  },

  bvEdit: function (e) {
    if (app.globalData.Guserdata.UserInfo.UserPhone == '' || app.globalData.Guserdata.UserInfo.UserPhone == undefined) {
      // 非会员先调用登录框
      this.setData({
        loginshow: true
      })
    } else {
      wx.redirectTo({
        url: "../promote/namecardedit"
      })
    }
  },
  // 长按号码响应函数
  bvPhoneNumTap: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.cardinfo.handphone,
    })
  },

  addContact: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['添加联系人'],
      success: function (res) {
        // 添加到手机通讯录
        wx.addPhoneContact({
          firstName: that.data.cardinfo.username, //联系人姓名
          title: that.data.cardinfo.title, //联系人职位
          mobilePhoneNumber: that.data.cardinfo.handphone, //联系人手机号
          weChatNumber: that.data.cardinfo.wechat, //微信
          email: that.data.cardinfo.email, //电子邮件
          organization: that.data.cardinfo.companyname, //公司
          url: that.data.cardinfo.website, //公司网站

        })
      }
    })
  },

  // 回递名片
  bvReplyCard() {},



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log("传入的参数为", options)
    if (options.userid) {
      // 如果是通过分享链接进入
      this.data.params = options
      this.data.remark = "通过小税宝用户分享名片进入"
      this.setData({
        // 页面根据tempinviterid的值设置了显隐渲染，所以需要用setData赋值
        tempinviterid: options.userid
      })
      // 本地函数查询分享人的名片信息
      const db = wx.cloud.database()
      db.collection('USER').where({
        UserId: options.userid
      }).get({
        success: res => {
          // 展示名片分享人的名片
          this.setData({
            cardinfo: res.data[0].NameCard
          })
        }
      })
      // 通过分享进入，执行用户登录操作，展示分享人的名片信息
      await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
    } else {
      // 在本人小程序中打开
      console.log("在本人小程序中打开")
      if (app.globalData.Guserdata == undefined || app.globalData.Guserdata.NameCard == undefined) {
        // 没有名片则展示样本
        console.log("执行了")
        this.setData({
          cardinfo: this.data.sample
        })
      } else {
        // 有名片展示本人名片
        this.setData({
          cardinfo: app.globalData.Guserdata.NameCard
        })
      }
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
  // 分享朋友圈
  onShareTimeline: function () {
    return {
      title: app.globalData.Guserdata.UserInfo.nickName + '推荐给您：',
      query: '/pages/promote/namecard?userid=' + app.globalData.Guserid,
      imageUrl: '', //封面
    }
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
      imageUrl: '', //封面，留空自动抓取500*400生成图片，真机有效，电脑调试会抓取整个页面
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