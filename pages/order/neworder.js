const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
var {
  _discountcheck,
  _inviterPLcheck,
 _membercheck,
_validuser,
  // _PLcheck,
} = require("../../utils/initialize")
Page({

  data: {
    eventid:"",
    // 轮播参数
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    // 传入的参数
    pageParam: "",
    //新增数据变量
    // 编号
    productid: "",
    // 商品名称
    productname: "",
    // 办理地点
    issuedplace: "",
    discountorderid: "",
    orderid: "",
    discountid: "",
    discountname: "",
    discountlevel: "",
    discounthidden: true,
    singlediscounthidden: true,
    // 订单费用标准（根据客户身份赋值）
    orderprice: "",
    // 订单费用计算标准（根据客户身份赋值）
    orderpricecount: 0,
    count: 1,
    // 净服务费，自动计算
    servicesfee: 0,
    // 积分折减前总办理费用，自动计算
    temptotalfee: 0,
    tempmaxpoints: 0, //可用积分上限
    maxpoints: 0, //本次可用积分上限
    tempprofit: 0,
    profit: 0, //可分配收益
    // 可用积分
    balance: 0,
    // 本次使用积分
    consumepoints: 0,
    // 总办理费用，自动计算 
    totalfee: 0,
    // 消费积分计算
    silverpoints: 0,
    goldpoints: 0,
    platinumpoints: 0,
    sublock: false,
    ordersublock: false,
    paymentsublock: false,
    submitted: false,
    btnhidden: true
  },
  _PLcheck:async function(eventid) {

      let res = await _membercheck(eventid)
      console.log(res)
      if (res == "normal") {
        console.log("不是会员")
        // 赋值
        var inviterPL = "member"
      } else if (res == "member") {
        console.log("是会员继续查询是否有PL订单")
        let voliduser = await _validuser(eventid)
        console.log(voliduser)
        let inviterPL = await _inviterPLcheck(voliduser)
        console.log(inviterPL)
      }
  },
  
  onShow: function () {
    this.setData({
      image: app.globalData.Gimagearray,
    })
    startToTrack()
  },
  // 随机生成支付订单号,订单号不能重复
  _getGoodsRandomNumber() {
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
  },

  bvCount(e) {
    this.setData({
      count: e.detail.count,
      temptotalfee: this.data.orderpricecount * e.detail.count,
    })
    this._totalfee()
    this._maxpointscount()
  },
  bvConsumePoints(e) {
    this.setData({
      consumepoints: e.detail.count,
    })
    this._totalfee()
  },

  _totalfee() {
    // 计算总费用
    this.setData({
      totalfee: this.data.temptotalfee - (this.data.consumepoints / app.globalData.Gsetting.pointsmagnification),
    })
    console.log("总费用", this.data.totalfee)
    this._pointscount()
  },
  _maxpointscount() {
    this.setData({
      tempmaxpoints: this.data.tempprofit * this.data.count * app.globalData.Gsetting.pointsmagnification
    })
    console.log("此商品本次可用积分上限", this.data.tempmaxpoints)
    if (this.data.balance >= this.data.tempmaxpoints) {
      this.setData({
        maxpoints: this.data.tempmaxpoints
      })
    } else {
      this.setData({
        maxpoints: this.data.balance
      })
    }
    console.log("用户本次可使用积分上限", this.data.maxpoints)
  },
  _pointscount() {
    this.setData({
      profit: this.data.tempprofit * this.data.count - this.data.consumepoints / app.globalData.Gsetting.pointsmagnification
    })
    console.log("可分配毛利润", this.data.profit)
    this.setData({
      silverpoints: Math.floor(this.data.profit / 3) * app.globalData.Gsetting.pointsmagnification,
      goldpoints: Math.floor(this.data.profit / 3) * 2 * app.globalData.Gsetting.pointsmagnification,
      platinumpoints: Math.floor(this.data.profit / 3) * app.globalData.Gsetting.pointsmagnification
    })
    console.log("silverpoints", this.data.silverpoints)
    console.log("goldpoints", this.data.goldpoints)
    console.log("platinumpoints", this.data.platinumpoints)
  },
  onLoad: async function (options) {
    this.setData({
      eventid:app.globalData.Ginviterid
    })
    let pl1=await this._PLcheck(this.data.eventid)
    console.log(pl1)
    this.setData({
      eventid:app.globalData.Gindirectinviterid
    })
    let pl2=await this._PLcheck(this.data.eventid)
    console.log(pl2)
 

    //页面初始化 options为页面跳转所带来的参数
    console.log(options)
    let that = this;
    this.setData({
      pageParam: options,
      productid: options.productid,
      balance: app.globalData.Guserdata.TradeInfo.Balance,
    })
    console.log(this.data.pageParam)
    await _discountcheck()

    // 筛选指定记录
    var fliter = [];
    // var _this = this
    for (var i = 0; i < app.globalData.Gproduct.length; i++) {
      if (app.globalData.Gproduct[i]._id == this.data.productid) {
        fliter.push(app.globalData.Gproduct[i]);
      }
    }
    console.log(fliter);
    if (app.globalData.Guserdata.TradeInfo.DiscountLevel == 'DL1') {
      this.setData({
        orderpricecount: fliter[0].Price1Count,
        orderprice: fliter[0].Price1,
        temptotalfee: fliter[0].Price1Count,
        tempprofit: 0
      })
      console.log(this.data.orderprice)
    } else if (app.globalData.Guserdata.TradeInfo.DiscountLevel == 'DL2') {
      this.setData({
        orderpricecount: fliter[0].Price2Count,
        orderprice: fliter[0].Price2,
        temptotalfee: fliter[0].Price2Count,
        tempprofit: fliter[0].Price2Count - fliter[0].Price1Count
      })
    } else if (app.globalData.Guserdata.TradeInfo.DiscountLevel == 'DL3') {
      this.setData({
        orderpricecount: fliter[0].Price3Count,
        orderprice: fliter[0].Price3,
        temptotalfee: fliter[0].Price3Count,
        tempprofit: fliter[0].Price3Count - fliter[0].Price1Count
      })
    } else if (app.globalData.Guserdata.TradeInfo.DiscountLevel == 'DL4') {
      this.setData({
        orderpricecount: fliter[0].Price4Count,
        orderprice: fliter[0].Price4,
        temptotalfee: fliter[0].Price4Count,
        tempprofit: fliter[0].Price4Count - fliter[0].Price1Count
      })
    }
    console.log("总费用", this.data.orderprice)
    // 计算总费用
    this.setData({
      productname: fliter[0].ProductName,
    })
    console.log("客户计算价格", this.data.orderpricecount)
    this._totalfee()
    this._maxpointscount()
  },

  //跳转注册资料页面
  onClick: function () {
    wx.navigateTo({
      url: 'https://sm758rc5kj.jiandaoyun.com/f/5c221c18326ce11b6be21cca',
    })
  },
  bvSubmit() {
    this.setData({
      orderid: this._getGoodsRandomNumber(),
    })

    this._orderadd()
    this._paymentadd()
    this._pointsadd()
  },

  // 异步新增数据方法
  _orderadd() {
    let that = this
    // 判断是否重复提交
    if (this.data.ordersublock) {
      that._hidden()
    } else {
      // 未锁定时执行
      // 获取数据库引用
      const db = wx.cloud.database()
      // 新增数据
      db.collection("ORDER").add({
        data: {
          OrderId: this.data.orderid,
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          OrderPrice: this.data.orderprice,
          OrderPriceCount: this.data.orderpricecount,
          UserId: app.globalData.Guserid,
          //费用
          Count: this.data.count,
          TempTotalFee: this.data.temptotalfee,
          // Balance:this.data.balance,
          ConsumePoints: this.data.consumepoints,
          TotalFee: this.data.totalfee,

          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          PaymentStatus: "unchecked",
          OrderStatus: "unchecked",
        },
        success(res) {
          that.setData({
            ordersublock: true // 修改上传状态并返回前端
          })
          that._hidden()
        },
        fail(res) {
          wx.showToast({
            title: '提交失败请重试',
            icon: 'fail',
            duration: 2000 //持续的时间
          })
        }

      })
    }
  },
  _paymentadd() {
    let that = this
    if (this.data.paymentsublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("PAYMENT").add({
        data: {
          OrderId: this.data.orderid,
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          UserId: app.globalData.Guserid,
          Count: this.data.count,
          TotalFee: this.data.totalfee,
          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          PaymentStatus: "unchecked",
        },
        success(res) {
          that.setData({
            paymentsublock: true
          })
          that._hidden()
        },
        fail(res) {
          wx.showToast({
            title: '提交失败请重试',
            icon: 'error',
            duration: 2000 //持续的时间
          })
        }
      })
    }
  },
  _pointsadd() {

    let that = this
    if (this.data.paymentsublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("POINTS").add({
        data: {
          OrderId: this.data.orderid,
          ProductId: this.data.productid,
          ProductName: this.data.productname,
          UserId: app.globalData.Guserid,
          Count: this.data.count,
          TotalFee: this.data.totalfee,
          // 直接推荐人
          InviterId: app.globalData.Ginviterid,
          // 间接推荐人
          IndirectInviterId: app.globalData.Gindirectinviterid,
          //  消费积分
          SilverPoints: this.data.silverpoints,
          GoldPoints: this.data.goldpoints,
          PlatinumPoints: this.data.platinumpoints,
          ConsumeId: app.globalData.Guserid,
          ConsumePoints: this.data.consumepoints,
          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese', {
            hour12: false
          }),
          PaymentStatus: "unchecked",
          PointsStatus: "unchecked",
        },
        success(res) {
          that.setData({
            paymentsublock: true
          })
          that._hidden()
        },
        fail(res) {
          wx.showToast({
            title: '提交失败请重试',
            icon: 'error',
            duration: 2000 //持续的时间
          })
        }
      })
    }
  },
  _hidden() {
    if (this.data.ordersublock == true && this.data.paymentsublock == true) {
      this.setData({
        submitted: true
      })
      wx.showToast({
        title: '订单提交成功',
        icon: 'success',
        duration: 2000, //持续的时间
      })
    }
  },
  bvPay() {
    wx.navigateTo({
      // 转到付款页面时，需要传递的参数orderid、productid、productname、totalfee、database
      url: '../order/pay?orderid=' + this.data.orderid + '&productid=' + this.data.productid + '&productname=' + this.data.productname + '&totalfee=' + this.data.totalfee + '&database=ORDER'
    })
  }
})