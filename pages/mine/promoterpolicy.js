const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adddate:"",
    startdate: "",
    startdate1: "",
    startdate2: "",
    startdate3: "",
    plstartdate: "",
    promoterlevel: "",
    promotername: "",
    totalfee: "",
    paymentid:"",
    productname:"",
    applysublock: false,
    paymentsublock: false,
    btn1hidden: true,
    btn2hidden: true,
    btn3hidden: true,
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
  },
  bvStartDate1(e) {
    this.setData({
      startdate1: e.detail.value,
    })
  },
  bvStartDate2(e) {
    this.setData({
      startdate2: e.detail.value,
    })
  },
  bvStartDate3(e) {
    this.setData({
      startdate3: e.detail.value,
    })
  },
  bvApply(e) {
    let that = this
    this.data.promoterlevel = e.currentTarget.dataset.level
    this.data.promotername = e.currentTarget.dataset.name
    this.data.plstartdate = e.currentTarget.dataset.startdate
    this.data.totalfee = e.currentTarget.dataset.price
    this.data.paymentid = this._getGoodsRandomNumber();
    if (this.data.plstartdate == "" || this.data.plstartdate == undefined) {
      wx.showToast({
        title: '请选择生效日期',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    } else {
      if (this.data.applysublock) {} else {
        const db = wx.cloud.database()
        // 新增数据
        db.collection("PROMOTERORDER").add({
          data: {
            PromoterLevel: this.data.promoterlevel,
            PromoterName: this.data.promotername,
            PLStartDate: this.data.plstartdate,
            TotalFee: this.data.totalfee,
            AddDate: new Date().toLocaleDateString(),
            SysAddDate: new Date().getTime(),
            PaymentId:this.data.paymentid,
            PaymentStatus: "unchecked",
            ApplyStatus: "unchecked",
          },
          success(res) {
            console.log("promoter成功")
            that.setData({
              applysublock: true
            })
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
      if (this.data.paymentsublock) {} else {
        const db = wx.cloud.database()
        db.collection("PAYMENT").add({
          data: {
            ProductId: this.data.promoterlevel,
            ProductName: this.data.promotername,
            TotalFee: this.data.totalfee,
            AddDate: new Date().toLocaleDateString(),
            PaymentStatus: "unchecked",
          },
          success(res) {
            console.log("payment成功")
            that.setData({
              paymentsublock: true
            })

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
      if (this.data.applysublock == true && this.data.paymentsublock == true) {
        wx.showToast({
          title: '成功提交转支付',
          icon: 'success',
          duration: 2000, //持续的时间
          success: function () {
            setTimeout(function () {
              wx.navigateTo({
                url: '../order/pay?totalfee=' + that.data.totalfee + '&productname=' +that.data.promotername+'&paymentid='+that.data.paymentid
              })
            }, 2000);
          }
        })

      }
    }

  },
  // 随机生成支付订单号,订单号不能重复
_getGoodsRandomNumber() {
  const date = new Date(); // 当前时间
  let Year = `${date.getFullYear()}`; // 获取年份
  let Month = `${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }`; // 获取月
  let Day = `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`; // 获取天
  let hour = `${
    date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  }`; // 获取小时
  let min = `${
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  }`; // 获取分钟
  let sec = `${
    date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  }`; // 获取秒
  let formateDate = `${Year}${Month}${Day}${hour}${min}${sec}`; // 时间
  return `${Math.round(Math.random() * 1000)}${formateDate +
    Math.round(Math.random() * 89 + 100).toString()}`;
},
  onLoad: function (options) {
    wx.getStorage({
      key: 'LDirectUser',
      success: res => {
        this.setData({
          directuser: res.data,
        })
        var directvalidfliter = [];
        for (var i = 0; i < this.data.directuser.length; i++) {
          if (this.data.directuser[i].avatarUrl != "" && this.data.directuser[i].avatarUrl != undefined) {
            directvalidfliter.push(this.data.directuser[i]);
          }
        }
        if (directvalidfliter.length >= 1 && directvalidfliter.length < 100) {
          this.setData({
            btn1hidden: false
          })
        } else if (directvalidfliter.length >= 100 && directvalidfliter.length < 300) {
          this.setData({
            btn2hidden: false
          })
        } else if (directvalidfliter.length >= 300) {
          this.setData({
            btn3hidden: false
          })
        }
      }
    })
    var str = new Date()
    this.setData({
      image: app.globalData.Gimagearray,
      startdate: str.getFullYear() + "-" + (str.getMonth() + 1) + "-" + str.getDate()
    })
    console.log(this.data.startdate)
    // let that=this
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PROMOTERORDER').where({
      _openid: app.globalData.Gopenid,
      PaymentStatus: "checked",
      ApplyStatus: "checked",
    }).orderBy('SysAddDate','desc').limit(1).get({
      success: res => {
        console.log(res.data.length)
        if (res.data.length != 0) {
          this.setData({
            adddate: res.data[0].AddDate,
            plstartdate: res.data[0].PLStartDate,
            promoterlevel: res.data[0].PromoterLevel,
            paymentstatus: res.data[0].PaymentStatus,
            applystatus: res.data[0].ApplyStatus,
            promotername: res.data[0].PromoterName,
          })
        }else{
          this.setData({
            promotername: "普客",
          })
        }
      },
      fail: res =>  {
        wx.showToast({
          title: '查询失败请刷新',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      }
    })


    // db.collection('PROMOTERORDER').where({
    //   _openid: app.globalData.Gopenid,
    //   PaymentStatus: "checked",
    //   ApplyStatus: "checked"
    // }).get({
    //   success: res => {
    //     console.log(res)
    //     if (res.data.length != 0 && res.data.length != undefined) {
    //       var tempfliter = []
    //       for (var i = 0; i < res.data.length; i++) {
    //         if (new Date(res.data[i].PLStartDate).getTime() <= new Date().getTime()) {
    //           tempfliter.push(res.data[i]);
    //         }
    //       }
    //       console.log(tempfliter)
    //       this.setData({
    //         plstartdate: tempfliter[0].PLStartDate,
    //         promoterlevel: tempfliter[0].PromoterLevel,
    //         paymentstatus: tempfliter[0].PaymentStatus,
    //         applystatus: tempfliter[0].ApplyStatus,
    //         promotername: tempfliter[0].PromoterName,
    //       })
    //     } else {
    //       this.setData({
    //         promotername: "普客",
    //       })
    //     }
    //   }
    // })

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})