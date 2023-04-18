// 新建页面埋点
const app = getApp()
// 新用户信息初始化字段
var newuserinfo = {
  nickName: "",
  avatarUrl: "",
  UserPhone: "",
  UserType: "client",
  Region: ["广东省", "深圳市", "南山区"],
  InviterId: "",
  InviterPhone: "",
  InviterAvatar: "",
  InviterNickName: "",
  IndirectInviterId: "",
}
var newusertradeinfo = {
  PromoteBalance: 0,
  TradeBalance:0,
  BalanceUpdateTime: new Date().toLocaleString('chinese', {
    hour12: false
  }),
  DiscountLevel: "DL4",
  DiscountType:"",
  DLUpdateTime: new Date().toLocaleString('chinese', {
    hour12: false
  }),
  PromoterLevel: "normal",
  PLUpdateTime: new Date().toLocaleString('chinese', {
    hour12: false
  }),
  // MemberTime:""
}

function _sendcode(userphone) {
  // 发送验证码
  var promise = new Promise((resolve, reject) => {
    if (userphone == "" || userphone == undefined) {
      _ErrorToast("请输入手机号码")
    } else {
      let _this = this;
      wx.cloud.callFunction({
        name: 'sendmessage',
        data: {
          templateId: "985130",
          nocode: false,
          mobile: userphone,
          nationcode: '86'
        },
        success: res => {
          let code = res.result.res.body.params[0];
          resolve(code)
        },
        fail: err => {
          _ErrorToast("发送失败请重试")
        }
      })
    }
  });
  return promise;
}

async function _NewMember(userphone, s_phonecode, u_phonecode) {
  var promise = new Promise((resolve, reject) => {
    if (s_phonecode == u_phonecode && u_phonecode != "") {
      console.log('手机验证码正确')
      const db = wx.cloud.database()
      db.collection('USER').where({
        UserId: app.globalData.Guserid
      }).update({
        data: {
          ["UserInfo.UserPhone"]: userphone,
          ["TradeInfo.MemberTime"]: new Date().toLocaleString('chinese', {
            hour12: false
          })
        },
        success: res => {
          resolve(res)
        },
      })
    } else {
      _ErrorToast("验证码错误")
    }
  });
  return promise;
}

async function _RegistPointsAdd() { // 通过云函数获取用户本人的小程序ID
  var promise = new Promise((resolve, reject) => {
    console.log('新会员手机认证积分')
    const db = wx.cloud.database()
    db.collection("POINTS").add({
      data: {
        PointsType: "promote",
        RegistrantId: app.globalData.Guserid,
        RegistrantPoints: 30,
        ProductName: "新会员手机认证积分",
        // 直接推荐人
        InviterId: app.globalData.Ginviterid,
        InviterPoints: 20,
        // 间接推荐人
        IndirectInviterId: app.globalData.Gindirectinviterid,
        IndirectInviterPoints: 10,
        SysAddDate: new Date().getTime(),
        AddDate: new Date().toLocaleString('chinese', {
          hour12: false
        }),
        PointsStatus: "checked",
      },
      success: res => {
        resolve(res)
      },
    })
  });
  return promise;
}
async function _SendNewUserSMS() { // 通过云函数获取用户本人的小程序ID
  var promise = new Promise((resolve, reject) => {
    //给推荐和和管理员发送短信
    if (app.globalData.Ginviterphone != undefined && app.globalData.Ginviterphone != "") {
      var tempmobile = [18954744612, app.globalData.Ginviterphone]
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
        console.log("短信发送结果", res)
        resolve(res)
      },
      fail: res => {
        console.log(res)
      },
    })
  });
  return promise;
}
async function UserLogon(tempinviterid, params, remark) { // 用户登录时的操作

  _setting();
  // 产品查询不是需要和折扣查询、会员等级查询可以的需要的时候再调用
  _productcheck();
  await _login();
  let data = await _usercheck(app.globalData.Guserid)
  console.log("data", data);
  if (data.length == 0) {
    // 新用户执行操作
    app.globalData.Ginviterid = tempinviterid
    await _invitercheck(app.globalData.Ginviterid)
    await _newuser(params, remark)
    _newuserpoints()
  } else {
    // 老用户执行操作
    app.globalData.Guserdata = data[0]
    app.globalData.Gindirectinviterid = data[0].UserInfo.IndirectInviterId
    app.globalData.Ginviterid = data[0].UserInfo.InviterId
    app.globalData.Ginviterphone = data[0].UserInfo.InviterPhone
    console.log("当前用户信息", app.globalData.Guserdata);
    await _discountcheck()
  }

}

async function _setting() { // 通过本地数据库查询指令取得小程序设置参数
  var promise = new Promise((resolve, reject) => {
    console.log("setting执行了")
    //获取小程序全局设置
    const db = wx.cloud.database()
    db.collection('setting')
      .doc('28ee4e3e60c48c3821c54eee6564dec5')
      .get({
        success: res => {
          console.log("成功获取设置参数", res);
          app.globalData.Gsetting = res.data;
          app.globalData.Gimagearray = res.data.swiper
          resolve(app.globalData.Gimagearray)
        }
      })
  });
  return promise;
}

async function _login() { // 通过云函数获取当前用户本人的小程序unionid
  var promise = new Promise((resolve, reject) => {
    console.log("login执行了")
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        // userid使用unionid
        app.globalData.Guserid = res.result.unionid
        console.log("用户unionid:", app.globalData.Guserid)
        resolve(res.result.unionid)
      }
    })
  });
  return promise;
}

function _usercheck(eventid) { // 通过本地函数查询当前用户是否是老用户
  var promise = new Promise((resolve, reject) => {
    console.log("usercheck执行中")
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: eventid,
    }).get({
      success: res => {
        console.log("当前用户信息", res);
        resolve(res.data)
      }
    })
  });
  return promise;
}

function _invitercheck(inviterid) {
  var promise = new Promise((resolve, reject) => {
    console.log("invitercheck执行了")
    // 新用户查询直接推荐人和间接推荐人信息，并存入本人USERINFO
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: inviterid
    }).get({
      success: res => {
        console.log(res)
        // 给本地数据赋值
        app.globalData.Ginviterphone = res.data[0].UserInfo.UserPhone
        app.globalData.Gindirectinviterid = res.data[0].UserInfo.InviterId

        newuserinfo.InviterId = res.data[0].UserId
        newuserinfo.InviterPhone = res.data[0].UserInfo.UserPhone
        newuserinfo.InviterAvatar = res.data[0].UserInfo.avatarUrl
        newuserinfo.InviterNickName = res.data[0].UserInfo.nickName
        newuserinfo.IndirectInviterId = res.data[0].UserInfo.InviterId
        resolve(res)
      },
    })
  });
  return promise;
}

function _newuser(params, remark) {
  console.log(params)
  console.log(remark)
  var promise = new Promise((resolve, reject) => {
    console.log("新用户操作执行了")
    // Guserdata的子项未在app中定义，须先构建obj再赋值给Guserdata
    var obj = new Object();
    obj = {
      UserInfo: newuserinfo,
      TradeInfo: newusertradeinfo,
    }
    app.globalData.Guserdata = obj

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
        resolve(res)
      },
    })
  });
  return promise;
}

function _newuserpoints() {
  var promise = new Promise((resolve, reject) => {
    db.collection("POINTS").add({
      data: {
        PointsType: "promote",
        UserId: app.globalData.Guserid,
        ProductName: "直接推广新用户积分",
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
        resolve(res)
      },
    })
  });
  return promise;
}

function _productcheck() { // 通过云函数查询在售商品
  var promise = new Promise((resolve, reject) => {
    console.log("productcheck执行了")
    // 使用云函数避免每次20条数据限制
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
        resolve(res.result.data)
      }
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
            if (new Date(res.data[i].DLStartDate).getTime() < new Date().getTime() && new Date(res.data[i].DLEndDate).getTime() > new Date().getTime()) {
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

function _directuser(eventid) {
  // 查询当前用户的推广总人数
  var promise = new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "USER",
        command: "and",
        where: [{
          ["UserInfo.InviterId"]: eventid
        }]
      },
      success: res => {
        wx.setStorageSync('LDirectUser', res.result.data);
        // 查询结果赋值给数组参数
        console.log("云函数查询直接推广用户", res.result.data)
        resolve(res.result.data)
      }
    })
  });
  return promise;
}

function _indirectuser(eventid) {
  var promise = new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "USER",
        command: "and",
        where: [{
          ["UserInfo.IndirectInviterId"]: eventid
        }]
      },
      success: res => {
        wx.setStorageSync('LIndirectUser', res.result.data);
        // 查询结果赋值给数组参数
        console.log("云函数查询间接推广用户", res.result.data)
        resolve(res.result.data)

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

async function _PLcheck(eventid) {
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
          ["UserId"]: eventid,
        }]
      },
      success: async res => {
        console.log(res)
        if (res.result.data[0].UserInfo.UserPhone == "" || res.result.data[0].UserInfo.UserPhone == undefined) {
          console.log("普客")
          // 赋值
          let PL = "normal"
          resolve(PL)
        } else {
          console.log("是会员继续查询是否有PL订单")
          let validuser = await _validuser1year(eventid)
          console.log(validuser)
          let PL = await _PLordercheck(validuser, eventid)
          console.log(PL)
          resolve(PL)
        }
      }
    })
  })
  return promise;
}

function _PLordercheck(validuser, eventid) {
  var promise = new Promise((resolve, reject) => {
    var now = new Date().getTime()
    console.log("本地函数查询推荐人的Promoter订单")
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PROMOTERORDER').where({
      UserId: eventid,
      PaymentStatus: "checked",
      OrderStatus: "checked",
    }).orderBy('SysAddDate', 'desc').limit(1).get({
      // 根据添加日期排序,只需要提取最后一条购买记录就可以
      success: res => {

        console.log("推广订单查询", res.data)
        console.log("有效推广用户数", validuser)
        console.log("当前时间戳", now)
        if (res.data.length != 0) {
          // 判断是否有效，根据购买规则，只存在有效或过期的情况，不存在购买后未生效的情况
          if (new Date(res.data[0].PLStartDate).getTime() < now && now < new Date(res.data[0].PLEndDate).getTime()) {
            // 在有效期内的PL
            var PL = res.data[0].PromoterLevel
            console.log("PL在有效期内")

            resolve(PL)
          } else if (new Date(res.data[0].PLEndDate).getTime() < now) {
            // 已过期的PL,进一步查询有效人数，不符合维持条件就转为member
            if (res.data[0].PromoterLevel == "platinum" && validuser >= 60) {
              var PL = "platinum"
              console.log("PL为白金")
              resolve(PL)
            } else if (res.data[0].PromoterLevel == "gold" && validuser >= 20) {
              var PL = "gold"
              console.log("PL为黄金")
              resolve(PL)
            } else if (res.data[0].PromoterLevel == "silver" && validuser >= 2) {
              var PL = "silver"
              console.log("PL白银")
              resolve(PL)
            } else {
              var PL = "member"
              console.log("PL为会员")
              resolve(PL)
            }
          }
        } else {
          // length=0,没有任何购买记录,之前已确认最低是会员
          var PL = "member"
          console.log("PL为会员")
          resolve(PL)
        }
      }
    })
  })
  return promise;
}
//云函数查询推荐人一年内的有效推广人数
async function _validuser1year(eventid) {
  var promise = new Promise((resolve, reject) => {
    var now = new Date().getTime()
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "USER",
        command: "and",
        where: [{
          ["UserInfo.InviterId"]: eventid,
          ["UserInfo.UserPhone"]: _.neq(""),
          ["SysAddDate"]: _.gte(now - 365 * 86400000)
        }]
      },
      success: res => {
        var validuser1year = res.result.data.length
        // 查询结果赋值给数组参数
        console.log("云函数查询直接推广用户", res.result.data)
        resolve(validuser1year)
      }
    })

  })
  return promise;
}
//云函数查询积分礼包
async function _packetcheck(eventid) {
  var promise = new Promise((resolve, reject) => {
    var now = new Date().getTime()
    const db = wx.cloud.database()
    const _ = db.command
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "POINTS",
        command: "and",
        where: [{
          TransferPacketId: eventid,
        }]
      },
      success: res => {
        console.log(res)
        resolve([res.result.data[0].RemainPoints, res.result.data[0].RemainPacket])
      }
    })

  })
  return promise;
}

function _pointshistory() {
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
            // 推广积分抵减
            ["ConsumeId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 推广积分转让
            ["TransferId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 积分兑换
            ["ExchangeId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 消费积分提现
            ["WithdrawId"]: app.globalData.Guserid,
            ["PointsStatus"]: "checked",
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          },
          {
            // 消费积分转让
            ["PointsType"]: "transfer",
            ["PointsStatus"]: "checked",
            ["DoneeId"]: app.globalData.Guserid,
            ["AddDate"]: _.gte(app.globalData.Guserdata.TradeInfo.MemberTime)
          }
        ]
      },
      success: res => {
        console.log("云函数查询积分记录", res.result.data)
        // 根据查询结果筛选
        let promotehistory = []
        let tradehistory = []
        for (let i = 0; i < res.result.data.length; i++) {
          if (res.result.data[i].PointsType == "promote") {
            promotehistory.push(res.result.data[i])
          } else if (res.result.data[i].PointsType == "trade") {
            if (res.result.data[i].InviterId == app.globalData.Guserid || res.result.data[i].IndirectInviterId == app.globalData.Guserid) {
              tradehistory.push(res.result.data[i])
            } else if (res.result.data[i].ConsumeId == app.globalData.Guserid) {
              promotehistory.push(res.result.data[i])
            }
          } else if (res.result.data[i].PointsType == "exchange") {
            promotehistory.push(res.result.data[i])
            tradehistory.push(res.result.data[i])
          } else if (res.result.data[i].PointsType == "withdraw") {
            tradehistory.push(res.result.data[i])
          } else if (res.result.data[i].PointsType == "transfer") {
            promotehistory.push(res.result.data[i])
          }
        }
        resolve([promotehistory, tradehistory])
      }
    })
  })
  return promise;
}

function _balanceupdate(promotebalance, tradebalance, balanceupdatetime) {
  var promise = new Promise((resolve, reject) => {
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        // 给数据库字库更新
        ["TradeInfo.PromoteBalance"]: promotebalance,
        ["TradeInfo.TradeBalance"]: tradebalance,
        ["TradeInfo.BalanceUpdateTime"]: balanceupdatetime,
      },
      success: res => {
        app.globalData.Guserdata.TradeInfo.PromoteBalance = promotebalance
        app.globalData.Guserdata.TradeInfo.TradeBalance = tradebalance
        app.globalData.Guserdata.TradeInfo.BalanceUpdateTime = balanceupdatetime
        resolve(res)
      }
    })
  });
  return promise;
}

// 根据时间戳随机订单号,订单号不能重复
function _getGoodsRandomNumber() {
  const date = new Date(); // 当前时间
  let Year = `${date.getFullYear()}`; // 获取年份
  let Month = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
      }`; // 获取月
  let Day = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`; // 获取天
  let hour = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
      }`; // 获取小时
  let min = `${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
      }`; // 获取分钟
  let sec = `${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
      }`; // 获取秒
  let formateDate = `${Year}${Month}${Day}${hour}${min}${sec}`; // 时间
  return `${Math.round(Math.random() * 1000)}${formateDate +
      Math.round(Math.random() * 89 + 100).toString()}`;
}


const showLoading = (tips = '加载中...') => {
  wx.showNavigationBarLoading()
  wx.showLoading({
    title: tips,
  })
}

const hideLoading = () => {
  wx.hideLoading()
  wx.hideNavigationBarLoading()
}

const hideLoadingWithErrorTips = (err = '加载失败...') => {
  hideLoading()
  _ErrorToast("加载失败...")
}
// 提示信息
function _SuccessToast(title) {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 2000 //持续的时间
  })
}

function _ErrorToast(title) {
  wx.showToast({
    title: title,
    icon: 'error',
    duration: 2000 //持续的时间
  })
}
// 快捷会议室
function _roomapply(promotebalance, tradebalance, balanceupdatetime) {
  var promise = new Promise((resolve, reject) => {
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).update({
      data: {
        // 给数据库字库更新
        ["TradeInfo.PromoteBalance"]: promotebalance,
        ["TradeInfo.TradeBalance"]: tradebalance,
        ["TradeInfo.BalanceUpdateTime"]: balanceupdatetime,
      },
      success: res => {
        app.globalData.Guserdata.TradeInfo.PromoteBalance = promotebalance
        app.globalData.Guserdata.TradeInfo.TradeBalance = tradebalance
        app.globalData.Guserdata.TradeInfo.BalanceUpdateTime = balanceupdatetime
        resolve(res)
      }
    })
  });
  return promise;
}

async function _UploadFiles(filelist,cloudpath) {
    // for循环里等待异步执行结果的方法，重要内容
    var promise = new Promise((resolve, reject) => {
    var tempfiles = []
    for (let i = 0; i < filelist.length; ++i) {
      tempfiles = tempfiles.concat(new Promise((resolve, reject) => {
        const filePath = filelist[i]
        const cloudPath = cloudpath + [i+1] + filePath.match(/\.[^.]+?$/)
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
      resolve(res)
    }, err => {
      console.log(err)
    })
  });
  return promise;
}
async function _RemoveFiles(filelist) {
  wx.cloud.deleteFile({
    fileList:filelist,
    success: res => {

    }
  })
}
module.exports = {
  // 提示信息
  _SuccessToast: _SuccessToast,
  _ErrorToast: _ErrorToast,

  UserLogon: UserLogon,
  _login: _login,
  _setting: _setting,
  _usercheck: _usercheck,
  _invitercheck: _invitercheck,
  _newuser: _newuser,
  _newuserpoints: _newuserpoints,

  _productcheck: _productcheck,
  _discountcheck: _discountcheck,
  _directuser: _directuser,
  _indirectuser: _indirectuser,

  _balanceupdate: _balanceupdate,
  _pointshistory: _pointshistory,
  _PLordercheck: _PLordercheck,
  _PLcheck: _PLcheck,
  _packetcheck: _packetcheck,
  _getGoodsRandomNumber: _getGoodsRandomNumber,

  _sendcode: _sendcode,
  _NewMember: _NewMember,
  _RegistPointsAdd: _RegistPointsAdd,
  _SendNewUserSMS: _SendNewUserSMS,

  showLoading: showLoading,
  hideLoading: hideLoading,
  hideLoadingWithErrorTips: hideLoadingWithErrorTips,
  // 快捷会议室
  _roomapply: _roomapply,
  _UploadFiles:_UploadFiles,
  _RemoveFiles:_RemoveFiles

}