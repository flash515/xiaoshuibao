const app = getApp()
var {
  _productcheck,
  _login,
  _setting,
  _usercheck,
  _newuser,
  _olduser,
  _invitercheck
} = require("../../utils/initialize")
Page({
  data: {
    params: {},
    newuserinfo: {
      UserName: "",
      nickName: "",
      avatarUrl: "",
      Region: ["广东省", "深圳市", "南山区"],
      UserPhone: "",
      CompanyName: "",
      CompanyId: "",
      BusinessScope: "",
      CompanyScale: "",
    },
    newusertradeinfo: {
      Balance: 0,
      DiscountLevel: "DL4",
      PromoterLevel: "normal",
      UserType: "client"
    },
    inviterid: "",
    tempinviterid: "",
    remark: "",
    indirectinviterid: "",
    tempimage: [],
    userinfo: {},
  },
  onLoad: async function (options) {
    //options内容：scene扫码参数，page跳转页面，type跳转类型，path1路径1，path2路径2，userid推荐人ID,productid产品id
    console.log("接收到的参数", options)
    console.log("跳转页面路径", options.page)
    app.globalData.Gparams = options
    //从快捷会议室邀请的快速跳转通道
    if (options.type == "express") {
      wx.redirectTo({
        url: "/pages/tools/meetingroom/expressmeeting?" + options
      })
    }
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
    //准备调用云数据库
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 调用初始化
    _setting()
    _productcheck()
    await _login()
    let data = await _usercheck()
    console.log("data", data);
    if (data.length == 0) {
      await _newuser()
    } else {
      app.globalData.Guserinfo = data[0].UserInfo
      app.globalData.Gtradeinfo = data[0].TradeInfo
      console.log("当前用户信息", app.globalData.Guserinfo);
      console.log("当前用户交易信息", app.globalData.Gtradeinfo);
      await _olduser()
    }
    await _invitercheck()
    if (app.globalData.Gparams.page != undefined && app.globalData.Gparams.page != "") {
      wx.navigateTo({
        url: app.globalData.Gparams.page,
      })
    } else {
      wx.switchTab({
        url: '../index/home',
      })
    }


  },

  //   (
  //   _productcheck().then((data) => {
  //     console.log(data)
  //     console.log("执行到最后位置了")
  //     _login().then(() => {
  //       _usercheck().then((data) => {
  //         console.log(data)
  //         // 判断是否新用户并提交数据库起始
  //         if (data.length == 0) {
  //           _newuser().then(() => {
  //             _invitercheck().then(() => {
  //               console.log(app.globalData.Gparams.page)
  //               if (app.globalData.Gparams.page != undefined && app.globalData.Gparams.page != "") {
  //                 wx.navigateTo({
  //                   url: app.globalData.Gparams.page,
  //                 })
  //               } else {
  //                 wx.switchTab({
  //                   url: '../index/home',
  //                 })
  //               }
  //             })
  //           })
  //         } else {
  //           // 老用户如果云数据库中有本人信息，则把用户数据存入本地全局变量，以供后续使用
  //           app.globalData.Guserdata = data[0]
  //           app.globalData.Guserinfo = data[0].UserInfo
  //           app.globalData.Gtradeinfo = data[0].TradeInfo
  //           console.log("当前用户信息", app.globalData.Guserinfo);
  //           console.log("当前用户信息", app.globalData.Gtradeinfo);
  //           // 查询结果赋值给数组参数
  //           //   this.setData({
  //           //   user: res.data[0].UserInfo,
  //           //  inviterid: res.data[0].InviterInfo.OpenId,
  //           //  })
  //           _olduser().then(() => {
  //             _invitercheck().then((data) => {
  //               console.log(app.globalData.Gparams.page)
  //               if (app.globalData.Gparams.page != undefined && app.globalData.Gparams.page != "") {
  //                 wx.navigateTo({
  //                   url: app.globalData.Gparams.page,
  //                 })
  //               } else {
  //                 wx.switchTab({
  //                   url: '../index/home',
  //                 })
  //               }
  //             })
  //           })
  //         }
  //       })
  //       _setting()
  //     })
  //     // 这里的参数判断逻辑是有效经典的，可以copy借鉴

  //   })

  //   // 通过云函数获取用户本人的小程序ID
  //   // wx.cloud.callFunction({
  //   //   name: 'login',
  //   //   data: {},
  //   //   success: res => {
  //   //     console.log("login成功:", res.result)
  //   //     app.globalData.Gopenid = res.result.openid

  //   //     // 查询小程序数据库是否有当前用户信息
  //   //     this._usercheck()
  //   //     this._setting()
  //   //     this._productcheck()
  //   //   }
  //   // })
  // },
  // )
  _productcheck() {
    console.log("productcheck执行了")
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "PRODUCT",
        command: "or",
        where: [{
          Status: "在售"
        }]
      },
      success: res => {
        app.globalData.Gproduct = res.result.data
        wx.setStorageSync('LProductList', res.result.data)
      }
    })
  },
  _setting() {
    //获取小程序全局设置
    let that = this
    const db = wx.cloud.database()
    db.collection('setting')
      .where({
        currentstatus: "effect"
      })
      .get({
        success: res => {
          app.globalData.Gpointsmagnification = res.data[0].pointsmagnification;
          app.globalData.Gsortarray = res.data[0].SortArray;
          console.log("成功获取设置参数", res);
          wx.setStorageSync('LSetting', res.data[0]);
          //异步获取图片生成轮播图地址
          for (let i = 0; i < res.data[0].swiper.length; i++) {
            wx.getImageInfo({
              //把图片地址转换为本地地址
              src: res.data[0].swiper[i],
              success(res) {
                that.data.tempimage.push(res.path)
                app.globalData.Gimagearray = that.data.tempimage
              }
            })
          }
        }
      })
  },
  _usercheck() {
    console.log("usercheck执行中")
    const db = wx.cloud.database()
    db.collection('USER').where({
      _openid: app.globalData.Gopenid,
    }).get({
      success: res => {
        console.log("当前用户信息", res);
        // 判断是否新用户并提交数据库起始
        if (res.data.length == 0) {
          this._newuser()
        } else {
          // 老用户如果云数据库中有本人信息，则把用户数据存入本地全局变量，以供后续使用
          app.globalData.Guserdata = res.data[0]
          app.globalData.Guserinfo = res.data[0].UserInfo
          app.globalData.Gtradeinfo = res.data[0].TradeInfo

          // 查询结果赋值给数组参数
          //   this.setData({
          //   user: res.data[0].UserInfo,
          //  inviterid: res.data[0].InviterInfo.OpenId,
          //  })
          this._olduser()
        }
      }
    })
  },
  _newuser() {
    console.log("新用户操作执行了")
    // 如果是新用户，检查是否有传递过来的推荐人id
    this.setData({
      inviterid: this.data.tempinviterid,
    })

    app.globalData.Ginviterid = this.data.tempinviterid
    app.globalData.Guserinfo = this.data.newuserinfo
    app.globalData.Gtradeinfo = this.data.newusertradeinfo
    console.log("Ginviterid", app.globalData.Ginviterid)
    console.log("Guserinfo", app.globalData.Guserinfo)
    // 在USER数据库中新增用户信息
    const db = wx.cloud.database()
    db.collection("USER").add({
      data: {
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString(),
        Params: this.data.params,
        UserInfo: this.data.newuserinfo,
        SystemInfo: app.globalData.Gsysteminfo,
        TradeInfo: this.data.newusertradeinfo,
        Remark: this.data.remark,
      },
      success: res => {
        console.log("新增用户数据执行成功")
        // 查询推荐人信息
        this._invitercheck()
      },
    })

  },
  _olduser() {
    var that = this
    console.log("未更新折扣级别", app.globalData.Gtradeinfo)
    console.log("执行老用户价格等级查询")
    // 老用户确认价格等级，这一步放在index操作是便于直接跳转到其他页面
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('DISCOUNTORDER').where({
      _openid: app.globalData.Gopenid,
      PaymentStatus: "checked",
      OrderStatus: "checked",
      Available: true,
    }).orderBy('OrderId', 'desc').get({
      success: res => {
        console.log("已购买的价格折扣卡", res)
        if (res.data.length != 0) {
          var tempfliter = []
          for (var i = 0; i < res.data.length; i++) {
            if (new Date(res.data[i].DLStartDate).getTime() <= new Date().getTime() && new Date(res.data[i].DLEndDate).getTime() >= new Date().getTime()) {
              tempfliter.push(res.data[i]);
            }
          }
          if (tempfliter.length != 0 && tempfliter.length != undefined) {
            console.log(tempfliter)
            console.log(tempfliter[0].DiscountLevel)
            // 更新对象型全局变量个别属性的方法
            app.globalData.Gtradeinfo.DiscountLevel = tempfliter[0].DiscountLevel
            app.globalData.Gtradeinfo.DiscountType = tempfliter[0].DiscountType
          } else {
            //卡券已过期            
            app.globalData.Gtradeinfo.DiscountLevel = "DL4"
          }
        } else {
          //没有卡券
          app.globalData.Gtradeinfo.DiscountLevel = "DL4"
        }
        console.log("已更新折扣级别", app.globalData.Gtradeinfo)
        // 查询推荐人信息
        this._invitercheck()
      }
    })

  },
  _invitercheck() {
    console.log("invitercheck执行了")
    // 查询推荐人信息
    const db = wx.cloud.database()
    db.collection('USER').where({
      _openid: app.globalData.Ginviterid
    }).get({
      success: res => {
        app.globalData.Ginviter = res.data[0].UserInfo
        this.setData({
          indirectinviterid: res.data[0].InviterInfo.OpenId, //间接推荐人的id
        })
        // 把需要的推荐人信息构建成对象数组赋值给全局变量
        var obj = new Object();
        obj = {
          "OpenId": res.data[0]._openid, //直接推荐人的id
          "Name": res.data[0].UserInfo.UserName,
          "Company": res.data[0].UserInfo.CompanyName,
          "Phone": res.data[0].UserInfo.UserPhone,
          "InviterOpenId": res.data[0].InviterInfo.OpenId, //间接推荐人的id
          "PromoterLevel": res.data[0].PromoterLevel,
          "DiscountLevel": res.data[0].DiscountLevel,
          "Balance": res.data[0].Balance,
        }
        app.globalData.Ginviter = obj
        db.collection('USER').where({
          _openid: app.globalData.openid
        }).update({
          data: {
            InviterInfo: obj
          }
        })
        // 以下全局变量将被Ginviter取代
        //app.globalData.Gindirectinviterid = res.data[0].InviterOpenId;
        //app.globalData.Ginviterpromoterlevel = res.data[0].PromoterLevel;
        //app.globalData.Ginviterbalance = res.data[0].Balance;
        console.log(app.globalData.Ginviter)

      },
      complete: res => {
        console.log("执行到最后位置了")

        // 这里的参数判断逻辑是有效经典的，可以copy借鉴
        console.log(app.globalData.Gparams.page)
        if (app.globalData.Gparams.page != undefined && app.globalData.Gparams.page != "") {
          wx.navigateTo({
            url: app.globalData.Gparams.page,
          })
        } else {
          wx.switchTab({
            url: '../index/home',
          })
        }

      }
    })
  },
  onShow: function () {

  },

})