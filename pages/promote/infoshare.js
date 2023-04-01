const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");
const wxpay = require("../../utils/WxPay");
var interval = null //倒计时函数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "获取验证码",
    currentTime: 60,
    disabled: false,
    s_phonecode: "",
    u_phonecode: "",
    buylikehidden:true,
    like:50,
    likepoints:0,
    totalfee:0,
    infoshow:true,
    inputValue: '',
    sharetitle: "",
    videourl: '',
    videodate: "",
    videotitle: "",
    videocontent: "",
    buylikearray:[{
      points:50,
      price:8.5,
      time: 1
    }, {
      points:100,
      price:17,
      time: 1
    }, {
      points:200,
      price:34,
      time: 1
    }, {
      points:300,
      price:51,
      time: 1
    }
    ],
    danmuList: [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }],
    sharetitle: "",
  },
  bvBuyLikeHidden(e) {
    this.setData({
      buylikehidden: false
    })
  },
  bvAddLike(e) {
    this.setData({
      buylikehidden: false
    })
  },
  bvBuyLike(e) {

        if (this.data.ordersublock == false && this.data.paymentsublock == false) {
          this.setData({
            discountlevel: e.currentTarget.dataset.level,
            discountid: e.currentTarget.dataset.id,
            discountname: e.currentTarget.dataset.name,
            discountstartdate: e.currentTarget.dataset.startdate,
            discountenddate: e.currentTarget.dataset.enddate,
            discounttotalfee: e.currentTarget.dataset.price,
            discounttype:e.currentTarget.dataset.type,
            // 生成订单号
            orderid:this._getGoodsRandomNumber(),
          })
          this._orderadd()
          this._paymentadd()
        }else {
          wx.showToast({
            title: '请勿重复提交',
            icon: 'error',
            duration: 2000 //持续的时间
          })
        }


    this.setData({
      buylikehidden: true
    })
  },
  bvPointsSelect(e){
    console.log(e.detail.cell)
    this.setData({
      totalfee:e.detail.cell.price,
      points:e.detail.cell.points
    })
  },
    // 点击支付按钮,发起支付
bvBuyLike(event) {
      const goodsnum = wxpay._getGoodsRandomNumber();
      const body = "资讯打赏";
      const PayVal = this.data.totalfee * 100;
      this._callWXPay(body, goodsnum, PayVal);
    },
    // 请求WXPay云函数,调用支付能力
_callWXPay(body, goodsnum, payVal) {
      let that = this
      wx.cloud.callFunction({
          name: 'WXPay',
          data: {
            // 需要将data里面的参数传给WXPay云函数
            body,
            goodsnum, // 商品订单号不能重复
            payVal, // 这里必须整数,不能是小数,而且类型是number,否则就会报错
          },
        })
        .then((res) => {
          console.log(res);
          const payment = res.result.payment;
          console.log(payment); // 里面包含appId,nonceStr,package,paySign,signType,timeStamp这些支付参数
          wx.requestPayment({
            // 根据获取到的参数调用支付 API 发起支付
            ...payment, // 解构参数appId,nonceStr,package,paySign,signType,timeStamp
            success: (res) => {
              console.log('支付成功', res);
              wxpay._orderupdate();
              wxpay._paymentupdate();
              wxpay._userupdate();
              that.setData({
                paymenthidden:true
              })
            },
            fail: (err) => {
              console.error('支付失败', err);
            },
          });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  _orderadd(){
    let that = this
    if (this.data.ordersublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      // 新增数据
      db.collection("DISCOUNTORDER").add({
        data: {
          OrderId:this.data.orderid,
          DiscountLevel: this.data.discountlevel,
          DiscountId: this.data.discountid,
          DiscountName: this.data.discountname,
          DiscountType: this.data.discounttype,
          DLStartDate: this.data.discountstartdate,
          DLEndDate: this.data.discountenddate,
          TotalFee: this.data.discounttotalfee,
          SysAddDate: new Date().getTime(),
          AddDate: new Date().toLocaleString('chinese',{ hour12: false }),
          PaymentStatus:"unchecked",
          OrderStatus:"unchecked",
          Available:false
        },
        success(res) {
          that.setData({
            ordersublock: true
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
  _paymentadd() {
    let that = this
    if (this.data.paymentsublock) {
      that._hidden()
    } else {
      const db = wx.cloud.database()
      db.collection("PAYMENT").add({
        data: {
          OrderId:this.data.orderid,
          ProductId: this.data.discountid,
          ProductName: this.data.discountname,
          TotalFee: this.data.discounttotalfee,
          AddDate: new Date().toLocaleString('chinese',{ hour12: false }),
          PaymentStatus: "unchecked",
          Database:"DISCOUNTORDER"
        },
        success(res) {
          console.log("paymentadd成功")
          that.setData({
            paymentsublock: true,
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
  getRandomColor() {
    const rgb = []
    for (let i = 0; i < 3; ++i) {
      let color = Math.floor(Math.random() * 256).toString(16)
      color = color.length === 1 ? '0' + color : color
      rgb.push(color)
    }
    return '#' + rgb.join('')
  },
  bvShareTitle(e) {
    this.setData({
      sharetitle: e.detail.value
    })
  },
  bvVideoTitle(e) {
    this.setData({
      videotitle: e.detail.value
    })
  },
  bvVideoContent(e) {
    this.setData({
      videocontent: e.detail.value
    })
  },
  bvVideoSelect(e) {
    console.log(e.detail.key)
    this.setData({
      videourl: e.detail.key
    })
  },

  bvUserPhone(e) {
    this.setData({
      userphone: e.detail.value
    })
  },

  _SendCodeBtn() {
    var that = this;
    var currentTime = that.data.currentTime
    interval = setInterval(function () {
      currentTime--;
      that.setData({
        time: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  bvSendCode() {
    if (this.data.userphone == "" || this.data.userphone == undefined) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'error',
        duration: 2000
      })
    } else {
      let _this = this;

      this.setData({
        disabled: true
      })
      wx.cloud.callFunction({
        name: 'sendmessage',
        data: {
          templateId: "985130",
          nocode: false,
          mobile: _this.data.userphone,
          nationcode: '86'
        },
        success: res => {
          let code = res.result.res.body.params[0];
          let result = res.errMsg;
          if (result == "cloud.callFunction:ok") {
            _this.setData({
              result: "发送成功",
              s_phonecode: code
            })
            this._SendCodeBtn()
          } else {
            _this.setData({
              result: "发送失败"
            })
          }
        },
        fail: err => {
          console.error('[云函数] [sendsms] 调用失败', err)
        }
      })
    }
  },
  bvPhoneCode(e) {
    this.setData({
      u_phonecode: e.detail.value
    })
  },
  bvChooseImage(e) {
    console.log(e.detail)
    this.setData({
      imageview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvRemoveImage(e) {
    this.setData({
      imageview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvUploadImage(e) {
    let that = this
    // 判断商品id是否空值
    if (this.data.companyname == "" || this.data.companyname == null) {
      wx.showToast({
        title: "企业名称不能为空",
        icon: 'none',
        duration: 2000
      })
    } else {
      // 判断是否重复提交
      if (this.data.imageuploadlock) {
        // 锁定时很执行
        wx.showToast({
          title: '请勿重复提交',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      } else {
        if (this.data.imageview.length == 0) {
          wx.showToast({
            title: '请先选取图片',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        } else {
          for (let i = 0; i < this.data.imageview.length; i++) {
            const filePath = this.data.imageview[i]
            const cloudPath = 'namecard/' + this.data.companyname + '/' + this.data.companyname + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log("fileID", res.fileID)
                this.data.imageview = this.data.imageview.concat(res.fileID)
                this.data.imageuploadlock = true // 修改上传状态为锁定

              }
            })
          }
        }

        // 异步上传，打印attachment时尚未返回数据
      }
    }
  },
  bvChooseLogo(e) {
    console.log(e.detail)
    // logo只有一个的情况不需要用数组
    this.setData({
      logoview: e.detail.all,
      logouploadlock: false
    })
  },
  bvRemoveLogo(e) {
    this.setData({
      logoview: e.detail.all,
      logouploadlock: false
    })
  },
  bvUploadLogo(e) {
    let that = this
    // 判断商品id是否空值
    if (this.data.companyname == "" || this.data.companyname == null) {
      wx.showToast({
        title: "企业名称不能为空",
        icon: 'none',
        duration: 2000
      })
    } else {
      // 判断是否重复提交
      if (this.data.logouploadlock) {
        // 锁定时很执行
        wx.showToast({
          title: '请勿重复提交',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      } else {
        if (this.data.logoview.length == 0) {
          wx.showToast({
            title: '请先选取图片',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        } else {
          for (let i = 0; i < this.data.logoview.length; i++) {
            const filePath = this.data.logoview[i]
            const cloudPath = 'namecard/' + this.data.companyname + filePath.match(/\.[^.]+?$/)
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log("fileID", res.fileID)
                // LOGO只有一个值的数组构建方式
                this.data.companylogo = [res.fileID]
                this.data.logouploadlock = true // 修改上传状态为锁定
                console.log("companylogo", this.data.companylogo)
              }
            })
          }
        }

        // 异步上传，打印attachment时尚未返回数据
      }
    }
  },
  bvEdit: function (e) {
    if(app.globalData.Guserdata.UserInfo.UserPhone==''||app.globalData.Guserdata.UserInfo.UserPhone==undefined){
    this.setData({
      loginshow: true
    })
  }else{
    this.setData({
      infoshow: false
    })
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      infovideos: app.globalData.Gsetting.infovideos,
      sharetitle: app.globalData.Guserdata.InfoShare.sharetitle,
      videourl: app.globalData.Guserdata.InfoShare.videourl,
      videotitle: app.globalData.Guserdata.InfoShare.videotitle,
      videocontent: app.globalData.Guserdata.InfoShare.videocontent,
      videodate: app.globalData.Guserdata.InfoShare.videodate,
    })

  },
  // 刷新信息
  RefreshData() {
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid
    }).get({
      success: res => {
        this.setData({
          videourl: res.data[0].InfoShare.videourl,
          videotitle: res.data[0].InfoShare.videotitle,
          videocontent: res.data[0].InfoShare.videocontent,
          sharetitle: res.data[0].InfoShare.sharetitle,
          videodate: res.data[0].InfoShare.videodate,
        })
      }
    })
  },

  //修改数据操作
  UpdateData(e) {

    if (this.data.s_phonecode == this.data.u_phonecode && this.data.u_phonecode != "") {
      console.log('手机验证码正确')
      const db = wx.cloud.database()
      db.collection('USER').where({
        UserId: this.data.openid
      }).update({
        data: {
          ["InfoShare.sharetitle"]: this.data.sharetitle,
          ["InfoShare.videotitle"]: this.data.videotitle,
          ["InfoShare.videocontent"]: this.data.videocontent,
          ["InfoShare.videourl"]: this.data.videourl,
          ["InfoShare.videodate"]: new Date().toLocaleString('chinese', {
            hour12: false
          }),
        },
        success(res) {
          wx.showToast({
            title: '更新信息成功',
            icon: 'success',
            duration: 2000 //持续的时间
          })
        },
        fail(res) {
          wx.showToast({
            title: '更新信息失败',
            icon: 'error',
            duration: 2000 //持续的时间
          })
        }
      })
      // 根据用户是否已验证手机号，提供首次验证积分
      if (this.data.useroldphone == "") {
        // 成为会员时间
        const db = wx.cloud.database()
        db.collection('USER').where({
          UserId: this.data.openid
        }).update({
          data: {
            ["TradeInfo.MemberTime"]: new Date().toLocaleString('chinese', {
              hour12: false
            })
          },
          success(res) {

          },
        })
        console.log('推广积分')
        db.collection("POINTS").add({
          data: {
            PointsType: "promoter",
            RegistrantId: app.globalData.Guserid,
            RegistrantPoints: 50,
            ProductName: "会员手机认证",
            // 直接推荐人
            InviterId: app.globalData.Ginviterid,
            InviterPoints: 30,
            // 间接推荐人
            IndirectInviterId: app.globalData.Gindirectinviterid,
            IndirectInviterPoints: 10,
            SysAddDate: new Date().getTime(),
            AddDate: new Date().toLocaleString('chinese', {
              hour12: false
            }),
            PointsStatus: "checked",
          },
          success(res) {
            console.log("POINTS更新成功")
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
              },
              fail: res => {
                console.log(res)
              },
            })
          },
        })

      }
    } else {
      wx.showToast({
        title: '验证码错误',
        icon: 'error',
        duration: 2000
      })

    }
  },
  bindInputBlur(e) {
    this.inputValue = e.detail.value
  },

  bindButtonTap() {
    const that = this
    wx.chooseMedia()({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success(res) {
        that.setData({
          videourl: res.tempFilePath
        })
      }
    })
  },

  bindVideoEnterPictureInPicture() {
    console.log('进入小窗模式')
  },

  bindVideoLeavePictureInPicture() {
    console.log('退出小窗模式')
  },

  bindPlayVideo() {
    console.log('1')
    this.videoContext.play()
  },
  bindSendDanmu() {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: this.getRandomColor()
    })
  },

  videoErrorCallback(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  // 点击 tab 时用此方法触发埋点
  onTabItemTap: () => startToTrack(),
  onShow: function () {
    startToTrack()
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
    startByBack()
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
      title: this.data.sharetitle,
      query: '/pages/promote/infoshare?userid=' + app.globalData.Guserid,
      imageUrl: '', //封面
    }
  },
  onHideMaskTap: function () {
    this.setData({
      loginshow: false
    })
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
      title: this.data.sharetitle,
      path: '/pages/promote/infoshare?userid=' + app.globalData.Guserid,
      imageUrl: '', //封面，留空自动抓取500*400生成图片
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