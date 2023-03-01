// 新建页面埋点
const app = getApp()
// 新用户信息初始化字段
var newuserinfo = {
  nickName: "",
  avatarUrl: "",
  UserName: "",
  UserPhone: "",
  CompanyName: "",
  CompanyId: "",
  BusinessScope: "",
  CompanyScale: "",
  InviterId: "",
  InviterCompany: "",
  InviterName: "",
  Region: ["广东省", "深圳市", "南山区"],
}
var newusertradeinfo = {
  Balance: 0,
  BalanceUpdateDate: "",
  DiscountLevel: "DL4",
  DiscountUpdateDate: "",
  PromoterLevel: "normal",
  PromoterUpdateDate: "",
  UserType: "client"
}

function _productcheck() {
  var promise = new Promise((resolve, reject) => {
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
        // _login()
        resolve(res.result.data)
      }
    })
  });
  return promise;
}

function _login() { // 通过云函数获取用户本人的小程序ID
  var promise = new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.Guserid = res.result.openid
        console.log("login成功:", app.globalData.Guserid)
        // 查询小程序数据库是否有当前用户信息
        // _usercheck()
        // _setting()
        resolve(res.result.openid)
      }
    })
  });
  return promise;
}

function _setting() {
  var promise = new Promise((resolve, reject) => {
    console.log("setting执行了")
    //获取小程序全局设置
    var tempimage = []
    const db = wx.cloud.database()
    db.collection('setting')
      .where({
        currentstatus: "effect"
      })
      .get({
        success: res => {
          wx.setStorageSync('LSetting', res.data[0]) //应使用全局参数替代，待调整
          app.globalData.Gsetting = res.data[0];

          console.log("成功获取设置参数", res);
          //异步获取图片生成轮播图地址
          for (let i = 0; i < res.data[0].swiper.length; i++) {
            wx.getImageInfo({
              //把图片地址转换为本地地址
              src: res.data[0].swiper[i],
              success(res) {
                tempimage.push(res.path)
                app.globalData.Gimagearray = tempimage
                resolve(res)
              }
            })
          }
        }
      })
  });
  return promise;
}

function _usercheck() {
  var promise = new Promise((resolve, reject) => {
    console.log("usercheck执行中")
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid,
    }).get({
      success: res => {
        console.log("当前用户信息", res);
        resolve(res.data)

      }
    })
  });
  return promise;
}

function _newuser(tempinviterid, params, remark) {
  console.log(tempinviterid)
  console.log(params)
  console.log(remark)
  var promise = new Promise((resolve, reject) => {
    console.log("新用户操作执行了")
    // 如果是新用户，检查是否有传递过来的推荐人id
    app.globalData.Ginviterid = tempinviterid
    // Guserdata的子项未在app中定义，须先构建obj再赋值给Guserdata
    var obj = new Object();
    obj = {
      UserInfo: newuserinfo,
      TradeInfo: newusertradeinfo
    }
    app.globalData.Guserdata = obj
    console.log("Ginviterid", app.globalData.Ginviterid)
    console.log("Guserdata", app.globalData.Guserdata)
    // 在USER数据库中新增用户信息
    const db = wx.cloud.database()
    db.collection("USER").add({
      data: {
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString(),
        UserId:app.globalData.Guserid,
        Params: params,
        SystemInfo: app.globalData.Gsysteminfo,
        UserInfo: newuserinfo,
        TradeInfo: newusertradeinfo,
        Remark: remark,
      },
      success: res => {
        console.log("新增用户数据执行成功")
        // 查询推荐人信息
        // _invitercheck()
        resolve(res.data)
      },
    })
  });
  return promise;
}

function _olduser() {
  var promise = new Promise((resolve, reject) => {
    console.log("未更新折扣级别", app.globalData.Guserdata.TradeInfo)
    console.log("执行老用户价格等级查询")
    // 老用户确认价格等级，这一步放在index操作是便于直接跳转到其他页面
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('DISCOUNTORDER').where({
      UserId: app.globalData.Guserid,
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
            app.globalData.Guserdata.TradeInfo.DiscountLevel = tempfliter[0].DiscountLevel
            app.globalData.Guserdata.TradeInfo.DiscountType = tempfliter[0].DiscountType
          } else {
            //卡券已过期            
            app.globalData.Guserdata.TradeInfo.DiscountLevel = "DL4"
          }
        } else {
          //没有卡券
          app.globalData.Guserdata.TradeInfo.DiscountLevel = "DL4"
        }
        console.log("已更新折扣级别", app.globalData.Guserdata.TradeInfo)
        // 查询推荐人信息
        // _invitercheck()
        resolve(res)
      }
    })
  });
  return promise;
}

function _invitercheck() {
  var promise = new Promise((resolve, reject) => {
    console.log("invitercheck执行了")
    // 新用户查询直接推荐人和间接推荐人信息，并存入本人USERINFO
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Ginviterid
    }).get({
      success: res => {
        console.log(res)
        app.globalData.Gindirectinviterid = res.data[0].UserInfo.InviterId
        app.globalData.Guserdata.UserInfo.InviterId = res.data[0].UserId
        app.globalData.Guserdata.UserInfo.InviterCompany = res.data[0].UserInfo.CompanyName
        app.globalData.Guserdata.UserInfo.InviterName = res.data[0].UserInfo.UserName
        const db = wx.cloud.database()
        db.collection('USER').where({
          UserId: app.globalData.Guserid
        }).update({
          data: {
            ["UserInfo.InviterId"]: res.data[0].UserId,
            ["UserInfo.InviterCompany"]: res.data[0].UserInfo.CompanyName,
            ["UserInfo.InviterName"]: res.data[0].UserInfo.UserName,
            ["UserInfo.IndirectInviterId"]: res.data[0].UserInfo.InviterId,
          },
          success: res => {
            console.log(res)
            db.collection("POINTS").add({
              data: {
                UserId: app.globalData.Guserid,
                ProductName: "直接推广积分",
                InviterId: app.globalData.Ginviterid,
                InviterPoints: 10,
                SysAddDate: new Date().getTime(),
                AddDate: new Date().toLocaleDateString(),
                PointsStatus: "checked",
                Resource: app.globalData.Guserid
              },
              success: res => {
                console.log("执行到最后位置了", res)
                resolve(res.data)
              },
            })
          }
        })

        console.log(app.globalData.Guserdata)

      },
    })
  });
  return promise;
}

function _directuser(){
  var promise = new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "USER",
      command: "and",
      where: [{
        ["UserInfo.InviterId"]: app.globalData.Guserid
      }]
    },
    success: res => {
      wx.setStorageSync('LDirectUser', res.result.data);
      // 查询结果赋值给数组参数
      console.log("云函数查询直接推广用户", res.result.data)
      resolve(res.data)

    }
  })
});
return promise;
}
function _indirectuser(){
  var promise = new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "USER",
        command: "and",
        where: [{
          ["UserInfo.IndirectInviterId"]: app.globalData.Guserid
        }]
      },
      success: res => {
        wx.setStorageSync('LIndirectUser', res.result.data);
        // 查询结果赋值给数组参数
        console.log("云函数查询间接推广用户", res.result.data)
        resolve(res.data)

      }
    })
  });
  return promise;
}


module.exports = {
  _productcheck: _productcheck,
  _login: _login,
  _setting: _setting,
  _usercheck: _usercheck,
  _newuser: _newuser,
  _olduser: _olduser,
  _invitercheck: _invitercheck,
  _directuser:_directuser,
  _indirectuser:_indirectuser
}