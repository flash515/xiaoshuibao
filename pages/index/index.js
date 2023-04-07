const app = getApp()
var utils = require("../../utils/utils")
Page({
  data: {
        // 初始化相关
    params: {},
    inviterid: "",
    tempinviterid: "",
    remark: "",
    indirectinviterid: "",
    userinfo: {},
    tempimage: [],
  },
  onLoad: async function (options) {
    //options内容：scene扫码参数，page跳转页面，type跳转类型，path1路径1，path2路径2，userid推荐人ID,productid产品id
    console.log("接收到的参数", options)
    app.globalData.Gparams = options
    //从快捷会议室邀请的快速跳转通道
    // if (options.type == "express") {
    //   wx.redirectTo({
    //     url: "/pages/tools/meetingroom/expressmeeting?" + options
    //   })
    // }
    // 接收参数方法一开始
    if (options.userid) {
      console.log("if操作执行了")
      this.setData({
        tempinviterid: options.userid,
      })
      console.log("方法一如果参数以userid=格式存在，则显示接收到的参数", this.data.tempinviterid);
      // 接收参数方法一结束
    } else if (options.scene) {
      console.log("elseif操作执行了")
      // 接收参数方法二开始，scene中只有参数值
      let scene = decodeURIComponent(options.scene);
      //可以连接多个参数值，&是我们定义的参数链接方式
      // let inviterid = scene.split('&')[0];
      // let userId = scene.split("&")[1];
      this.setData({
        tempinviterid: scene.split('&')[0],
      })
      console.log("扫码参数:", this.data.tempinviterid);
    } else {
      // 两种都不带参数，则是自主搜索小程序进入，推荐人指定为开发人
      this.data.tempinviterid = "omLS75Xib_obyxkVAahnBffPytcA"
      this.data.remark = "无参数进入"
      console.log("搜索进入参数:", this.data.tempinviterid);
    }

    // 调用方法初始化
    utils._setting()
    utils._productcheck()
    await utils._login()
    let data = await utils._usercheck(app.globalData.Guserid)
    console.log("data", data);
    if (data.length == 0) {
      await utils._newuser(this.data.tempinviterid,this.data.params,this.data.remark)
      await utils._invitercheck()
    } else {
      app.globalData.Guserdata = data[0]
      app.globalData.Gindirectinviterid=data[0].UserInfo.IndirectInviterId
      app.globalData.Ginviterid=data[0].UserInfo.InviterId
      app.globalData.Ginviterphone=data[0].UserInfo.InviterPhone
      console.log("当前用户信息", app.globalData.Guserdata);
      await utils._discountcheck()
    }
      wx.switchTab({
        url: '../index/home',
      })

//页面跳转设置
    // if (app.globalData.Gparams.page != undefined && app.globalData.Gparams.page != "") {
    //   wx.navigateTo({
    //     url: app.globalData.Gparams.page,
    //   })
    // } else {
    //   wx.switchTab({
    //     url: '../index/home',
    //   })
    // }


  },

  onShow: function () {

  },

})