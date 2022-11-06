const app = getApp()
Page({
  data: {
    params: [],
    inviterid: "",
    tempinviterid: "",
    remark: "",
    indirectinviterid: "",
    invitercompanyname: "",
    inviterusername: "",
    tempimage: [],
    userinfo: [],
    sendsms: false,
  },
  onLoad: function (options) {

    console.log("接收到的参数", options)
    console.log("跳转页面路径", options.page)
    app.globalData.Gparams = options
    //从快捷会议室邀请的快速跳转通道
if(options.type=="express"){
  wx.redirectTo({
    url:"/pages/tools/meetingroom/expressmeeting?"+options
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
    // 通过云函数获取用户本人的小程序ID
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log("login成功:", res.result)
        app.globalData.Gopenid = res.result.openid

        // 查询小程序数据库是否有当前用户信息
        this._usercheck()
        this._setting()
        this._productcheck()
      }
    })
  },

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
          console.log("轮播图：", res);
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
          // 老用户如果云数据库中有本人信息，则把用户本人信息存入本地
          app.globalData.Guserinfo = res.data[0]
          app.globalData.Ginviterid = res.data[0].InviterOpenId;
          wx.setStorageSync('LUserInfo', res.data[0]);
          // 查询结果赋值给数组参数
          this.setData({
            userinfo: res.data[0],
            inviterid: res.data[0].InviterOpenId,
          })
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
      sendsms: true
    })
    // 对象中的属性可以直接这样赋值吗？
    app.globalData.Ginviterid = this.data.tempinviterid
    app.globalData.Guserinfo.UserType = "client"
    app.globalData.Guserinfo.DiscountLevel = "DL4"
    app.globalData.Guserinfo.PromoterLevel = "null"
    app.globalData.Guserinfo.Balance = 0
    app.globalData.Guserinfo.Region = ["广东省", "深圳市", "福田区"]
    app.globalData.Guserinfo.UserPhone = ""
    // 在USER数据库中新增用户信息
    const db = wx.cloud.database()
    db.collection("USER").add({
      data: {
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString(),
        InviterOpenId: this.data.inviterid,
        InviterCompanyName: this.data.invitercompanyname,
        InviterUserName: this.data.inviterusername,
        UserType: "client",
        UserPhone: "",
        DiscountLevel: "DL4",
        PromoterLevel: "normal",
        Balance: 0,
        Region: ["广东省", "深圳市", "福田区"],
        SystemInfo:app.globalData.Gsysteminfo,
        Remark: this.data.remark
      },
      success: res => {

        // 查询推荐人信息
        this._invitercheck()
      },
    })

  },
  _olduser() {
    console.log("执行老用户价格等级查询")
    // 老用户确认价格等级
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
            app.globalData.Guserinfo.DiscountLevel = tempfliter[0].DiscountLevel
            app.globalData.Gdiscounttype = tempfliter[0].DiscountType
            console.log(app.globalData.Guserinfo.DiscountLevel)
          } else {
            //卡券已过期
            app.globalData.Guserinfo.DiscountLevel = "DL4"
          }
        } else {
          //没有卡券
          app.globalData.Guserinfo.DiscountLevel = "DL4"
        }
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
        wx.setStorageSync('LInviter', res.data[0]);
        this.setData({
          invitercompanyname: res.data[0].CompanyName,
          inviterusername: res.data[0].UserName,
          indirectinviterid: res.data[0].InviterOpenId
        })
        // 把需要的推荐人信息构建成对象数组赋值给全局变量
        var obj = new Object();
        obj = {
          "InviterOpenId": res.data[0].InviterOpenId,
          "PromoterLevel": res.data[0].PromoterLevel,
          "Balance": res.data[0].Balance,
          "UserPhone": res.data[0].UserPhone,
        }
        app.globalData.Ginviter = obj
        // 以下全局变量将被Ginviter取代
        app.globalData.Gindirectinviterid = res.data[0].InviterOpenId;
        app.globalData.Ginviterpromoterlevel = res.data[0].PromoterLevel;
        app.globalData.Ginviterbalance = res.data[0].Balance;
        console.log(app.globalData.Gindirectinviterid)

      },
      complete: res => {
        console.log("执行到最后位置了")
        if (this.data.sendsms==true) {
          if (app.globalData.Ginviter.UserPhone != undefined && app.globalData.Ginviter.UserPhone != "") {
            var tempmobile = [18954744612, app.globalData.Ginviter.UserPhone]
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
              console.log(res)
            },
            fail: res => {
              console.log(res)
            },
          })
        }

        console.log(app.globalData.Gparams.page)
        // 这里的参数判断逻辑是有效经典的，可以copy借鉴
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