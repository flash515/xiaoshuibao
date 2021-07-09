const app = getApp()
Page({
  data: {
    //inviterid接收传入的参数
    inviterid: "",
    invitercompanyname: "",
    inviterusername: "",
    tempimage: [],
    userinfo: [],
  },
  onLoad: function (options) {
    let that = this
    // 接收参数方法一开始
    if (options.userid) {
      // let that = this;
      // let inviterid = options.userid;
      this.setData({
        inviterid: options.userid
      })
      console.log("方法一如果参数以userid=格式存在，则显示接收到的参数", options.userid);
      // 接收参数方法一结束
    } else {
      // 接收参数方法二开始，scene中只有参数值
      if (options.scene) {
        let scene = decodeURIComponent(options.scene);
        //可以连接多个参数值，&是我们定义的参数链接方式
        // let inviterid = scene.split('&')[0];
        // let userId = scene.split("&")[1];
        this.setData({
          inviterid: scene.split('&')[0]
        })
        console.log("方法二接到的参数:", this.data.inviterid);
      } else {
        // 两种都不带参数，则是搜索小程序进入，推荐人指定
        this.setData({
          inviterid: "omLS75T9_sWFA7pBwdg0uL6AUtcI"
        })
      }
    }
    //获取小程序全局设置
    const db = wx.cloud.database()
    db.collection('setting').where({
      currentstatus: "effect"
    }).get({
      success: res => {
        wx.setStorageSync('LSetting', res.data[0]);
         //异步获取图片生成轮播图地址
        for (let i = 0; i < res.data[0].swiper.length; i++) {
          wx.getImageInfo({
            //把图片地址转换为本地地址
            src: res.data[0].swiper[i],
            success (res) {
              that.data.tempimage.push(res.path)
              app.globalData.Gimagearray = that.data.tempimage

            }
          })
        }
      }
    })

    //准备调用云数据库
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 通过传递来的参数查询推荐人信息
    db.collection('USER').where({
      _openid: this.data.inviterid
    }).get({
      success: res => {
        wx.setStorageSync('LInviterUser', res.data[0]);
        this.setData({
          invitercompanyname: res.data[0].CompanyName,
          inviterusername: res.data[0].UserName
        })
      }
    })

    // 通过云函数获取用户本人的小程序ID
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.Gopenid = res.result.openid
        console.log("全局参数Gopenid=:", app.globalData.Gopenid)
        // 查询小程序数据库是否有当前用户信息
        const db = wx.cloud.database()
        db.collection('USER').where({
          _openid: res.result.openid,
        }).get({
          success: res => {
            console.log(res);
            // 如果云数据库中有本人信息，则把用户本人信息存入本地
            wx.setStorageSync('LUserInfo', res.data[0]);
            // 查询结果赋值给数组参数
            this.setData({
              userinfo: res.data[0]
            })
            console.log(res.data.length);
            // 判断是否新用户并提交数据库起始
            if (res.data.length == 0) {
              // 在USER数据库中新增用户信息
              db.collection("USER").add({
                data: {
                  SysAddDate: new Date().getTime(),
                  AddDate: new Date().toLocaleString(),
                  InviterOpenId: this.data.inviterid,
                  InviterCompanyName: this.data.invitercompanyname,
                  InviterUserName: this.data.inviterusername,
                  UserType: "client",
                  PriceLevel:"PL4",
                  PromoterLevel:"normal",
                }
              })
              app.globalData.Gusertype = "client"
              app.globalData.Gpricelevel="PL4"
              app.globalData.Gpromoterlevel="null"

            } else {
              app.globalData.Gcompanyname = this.data.userinfo.CompanyName
              app.globalData.Gusername = this.data.userinfo.UserName
              app.globalData.GnickName = this.data.userinfo.nickName
              app.globalData.GavatarUrl = this.data.userinfo.avatarUrl
              app.globalData.Gusertype = this.data.userinfo.UserType
              app.globalData.Gpricelevel = this.data.userinfo.PriceLevel
              app.globalData.Gpromoterlevel = this.data.userinfo.PromoterLevel
            }
            // 判断是否新用户并提交数据库的代码框结束
          }
        })
      }
    })


  },

  onShow: function () {
    // 延时跳转
    setTimeout(function () {
      wx.switchTab({
        url: '../index/home',
      })
    }, 4000)
  },

})