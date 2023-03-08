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
  InviterPhone: "",
  IndirectInviterId: "",
  Region: ["广东省", "深圳市", "南山区"],
}
var newusertradeinfo = {
  Balance: 0,
  BalanceUpdateTime: new Date().toLocaleString('chinese', {
    hour12: false
  }),
  DiscountLevel: "DL4",
  DLUpdateTime: new Date().toLocaleString('chinese', {
    hour12: false
  }),
  PromoterLevel: "normal",
  PLUpdateTime: new Date().toLocaleString('chinese', {
    hour12: false
  }),
  UserType: "client",
  // MemberTime:""
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
        AddDate: new Date().toLocaleString('chinese', {
          hour12: false
        }),
        UserId: app.globalData.Guserid,
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

function _discountcheck() {
  console.log("老用户执行价格等级查询")
  var promise = new Promise((resolve, reject) => {
    console.log("未更新折扣级别", app.globalData.Guserdata.TradeInfo)

    // 老用户确认价格等级，这一步放在index操作是便于直接跳转到其他页面
    const db = wx.cloud.database()
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
        // 给本地数据赋值
        app.globalData.Gindirectinviterid = res.data[0].UserInfo.InviterId
        app.globalData.Guserdata.UserInfo.InviterId = res.data[0].UserId
        app.globalData.Guserdata.UserInfo.InviterCompany = res.data[0].UserInfo.CompanyName
        app.globalData.Guserdata.UserInfo.InviterName = res.data[0].UserInfo.UserName
        app.globalData.Ginviterphone = res.data[0].UserInfo.UserPhone
        const db = wx.cloud.database()
        db.collection('USER').where({
          UserId: app.globalData.Guserid
        }).update({
          data: {
            // 给数据库字库更新
            ["UserInfo.InviterId"]: res.data[0].UserId,
            ["UserInfo.InviterCompany"]: res.data[0].UserInfo.CompanyName,
            ["UserInfo.InviterName"]: res.data[0].UserInfo.UserName,
            ["UserInfo.InviterPhone"]: res.data[0].UserInfo.UserPhone,
            ["UserInfo.IndirectInviterId"]: res.data[0].UserInfo.InviterId,

          },
          success: res => {
            console.log(res)
            db.collection("POINTS").add({
              data: {
                UserId: app.globalData.Guserid,
                ProductName: "直接推广积分",
                InviterId: app.globalData.Ginviterid,
                InviterPoints: 5,
                SysAddDate: new Date().getTime(),
                AddDate: new Date().toLocaleString('chinese', {
                  hour12: false
                }),
                PointsStatus: "checked",
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

function _directuser() {
  // 查询当前用户的推广总人数
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

function _indirectuser() {
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

function _discount() {
  var promise = new Promise((resolve, reject) => {
    const _ = db.command
    wx.cloud.collection('DISCOUNTORDER').where({
      UserId: app.globalData.Guserid,
      PaymentStatus: "checked",
      OrderStatus: "checked",
      Available: true,
    }).orderBy('OrderId', 'desc').get({
      success: res => {
        console.log(res)
        if (res.data.length != 0) {
          //如果有购买记录则执行，进一步筛选当前有效的折扣订单

          var tempfliter = []
          for (var i = 0; i < res.data.length; i++) {
            if (new Date(res.data[i].DLStartDate).getTime() <= new Date().getTime() && new Date(res.data[i].DLEndDate).getTime() >= new Date().getTime()) {
              //如果有在有效期内的折扣，则给tempfliter赋值
              tempfliter.push(res.data[i]);
            }
          }
          console.log(tempfliter)
          resolve(tempfliter);
          if (tempfliter.length != 0 && tempfliter.length != undefined) {
            //tempfliter不为空时（有效的折扣），给参数赋值
            console.log(tempfliter)
            this.setData({
              discountorderid: tempfliter[0]._id,
              discountid: tempfliter[0].DiscountId,
              discounthidden: false,
              discountname: tempfliter[0].DiscountName,
              discountlevel: tempfliter[0].DiscountLevel,
              adddate: tempfliter[0].AddDate,
              dlstartdate: tempfliter[0].DLStartDate,
              dlenddate: tempfliter[0].DLEndDate,

            })
          } else {
            //如果没有在有效期内的折扣，则直接给参数赋值
            this.setData({
              discountlevel: "DL4",
              discounthidden: true,
            })
            console.log(this.data.discountlevel)
          }
        } else {
          // 如果没有折扣卡购买记录，直接赋值
          this.setData({
            discountlevel: "DL4",
            discounthidden: true,
          })
        }
        console.log(this.data.discountlevel)

      }
    })
  });
  return promise;
}

async function _membercheck() {
  var promise = new Promise((resolve, reject) => {
    // 查询是否是会员
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "USER",
        command: "and",
        where: [{
          ["UserId"]: app.globalData.Ginviterid,
        }]
      },
      success: res => {
        console.log(res)
        if (res.result.data[0].UserInfo.UserPhone == "" || res.result.data[0].UserInfo.UserPhone == undefined) {
          console.log("执行到这里了")
          var inviterPL = "normal"
          resolve(inviterPL)
        } else {
          var inviterPL = "member"
          resolve(inviterPL)
        }
      }
    })
  });
  return promise;
}

function _inviterPLcheck(voliduser) {
  var promise = new Promise((resolve, reject) => {
    var now = new Date().getTime()
    console.log("本地函数查询推荐人的Promoter订单")
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PROMOTERORDER').where({
      UserId: app.globalData.Ginviterid,
      PaymentStatus: "checked",
      OrderStatus: "checked",
    }).orderBy('SysAddDate', 'desc').limit(1).get({
      // 根据添加日期排序并选择最后一个记录
      success: res => {

        console.log(res.data)
        console.log(voliduser)
        console.log(new Date(res.data[0].PLStartDate).getTime())
        console.log(new Date(res.data[0].PLEndDate).getTime())
        console.log(now)
        if (res.data.length != 0) {
          if (new Date(res.data[0].PLStartDate).getTime() <= now && now <= new Date(res.data[0].PLEndDate).getTime()) {
            var inviterPL = res.data[0].PromoterLevel
            console.log("2")
            resolve(inviterPL)
          } else if (new Date(res.data[0].PLEndDate).getTime() < now) {
            // 已过期,进一步查询有效人数
            if (res.data[0].PromoterLevel == "platinum" && voliduser >= 60) {
              var inviterPL = "platinum"
              console.log("PL为白金")
              resolve(inviterPL)
            } else if (res.data[0].PromoterLevel == "gold" && voliduser >= 20) {
              var inviterPL = "gold"
              console.log("PL为黄金")
              resolve(inviterPL)
            } else if (res.data[0].PromoterLevel == "sliver" && voliduser >= 2) {
              var inviterPL = "sliver"
              console.log("PL白银")
              resolve(inviterPL)
            } else {
              var inviterPL = "member"
              console.log("PL为会员")
              resolve(inviterPL)
            }
          } else {
            var inviterPL = "member"
            console.log("PL为会员")
            resolve(inviterPL)
          }
          // 进一步查询是否符合新条件
          resolve(inviterPL)
        }
      }
    })
  })
  return promise;
}

async function _validuser() {
  var promise = new Promise((resolve, reject) => {
    //云函数查询推荐人一年内的有效推广人数
    var now = new Date().getTime
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "USER",
        command: "and",
        where: [{
          ["UserInfo.InviterId"]: app.globalData.Ginviterid,
          ["UserInfo.UserPhone"]: _.neq(""),
          ["SysAddDate"]: _.gte(now - 365 * 86400000)
        }]
      },
      success: res => {
        var validuser = res.result.data.length
        // 查询结果赋值给数组参数
        console.log("云函数查询直接推广用户", res.result.data)
        resolve(validuser)
      }
    })

  })
  return promise;
}

async function _PLcheck() {
  var promise = new Promise((resolve, reject) => {
    let res = await _membercheck()
    console.log(res)
    if (res == "normal") {
      console.log("不是会员")
      // 赋值
      var inviterPL = "member"
    } else if (res == "member") {
      console.log("是会员继续查询是否有PL订单")
      let voliduser = await _validuser()
      console.log(voliduser)
      let inviterPL = await _inviterPLcheck(voliduser)
      console.log(inviterPL)
    }
    resolve(inviterPL)
  })
  return promise;
}

function _promotercheck() {
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

function _balancecheck() {

  var promise = new Promise((resolve, reject) => {
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "or",
        where: [{
            // 手机认证积分
            ["RegistrantId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 直接推荐积分
            ["InviterId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 间接推荐积分
            ["IndirectInviterId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 积分使用
            ["ConsumeId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          }
        ]
      },
      success: res => {
        wx.setStorageSync('LPoints', res.result.data);
        // 查询结果赋值给数组参数
        console.log("云函数查询相关积分", res.result.data)
        resolve(res.result.data)

      }
    })
  });
  return promise;
}

function _pointscheck() {
  console.log(app.globalData.Guserdata.TradeInfo.MemberTime)
  var promise = new Promise((resolve, reject) => {
    const db = wx.cloud.database()
    const _ = db.command
    // 查询成为会员后的全部相关points记录
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "or",
        where: [{
            // 手机认证积分
            ["RegistrantId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 直接推荐积分
            ["InviterId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 间接推荐积分
            ["IndirectInviterId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 积分使用
            ["ConsumeId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          }
        ]
      },
      success: res => {
        wx.setStorageSync('LPoints', res.result.data);
        // 查询结果赋值给数组参数
        console.log("云函数查询相关积分", res.result.data)
        resolve(res.result.data)

      }
    })
  })
  return promise;
}

function _balanceupdate() {
  var promise = new Promise((resolve, reject) => {
    var balance = 15
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        // 给数据库字库更新
        ["TradeInfo.Balance"]: balance,
        ["TradeInfo.BalanceUpdateTime"]: new Date().toLocaleString('chinese', {
          hour12: false
        }),
      },
      success: res => {
        resolve(res)
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
  _invitercheck: _invitercheck,
  _directuser: _directuser,
  _indirectuser: _indirectuser,
  _discountcheck: _discountcheck,
  _promotercheck: _promotercheck,
  _balanceupdate: _balanceupdate,
  _balancecheck: _balancecheck,
  _pointscheck: _pointscheck,
  _inviterPLcheck: _inviterPLcheck,
  _membercheck: _membercheck,
  _validuser: _validuser,
  _PLcheck:_PLcheck
}