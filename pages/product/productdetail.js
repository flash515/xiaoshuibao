const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
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
    //通过对页面内容分区域设置隐藏，达到分栏显示效果,hidden要反着写，显示的值为false,不显示的值为true
    DetailHidden: false,
    QAHidden: true,
    AttachmentHidden: true,
    pageParam: [],
    usertype: "client",
    discountlevel: "",
    product: [],
    array: [],
    qaarray: [],
    question: "",
    answer: "",
    sublock: false,
    replylock: false,
    tempimage:[],
    // 产品轮播参数
    swiperData: [],
    swiperHeight: "", // swiper的高度
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },

  computeImgHeight(e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px" //等比设置swiper的高度。  
    //即 屏幕宽度 / swiper高度 = 图片宽度 / 图片高度  -->  swiper高度 = 屏幕宽度 * 图片高度 / 图片宽度
    this.setData({
      swiperHeight: swiperH //设置swiper高度
    })

  },

  bvDetailView() {
    this.setData({
      DetailHidden: false,
      QAHidden: true,
      AttachmentHidden: true,
    })
  },
  bvQAView() {
    this.setData({
      DetailHidden: true,
      QAHidden: false,
      AttachmentHidden: true,
    })
  },
  bvAttachmentView() {
    this.setData({
      DetailHidden: true,
      QAHidden: true,
      AttachmentHidden: false,
    })
  },

  bvQuestion(e) {
    this.setData({
      question: e.detail.value
    })
  },
  bvAnswer(e) {
    this.setData({
      answer: e.detail.value
    })
  },
  //图片点击事件
  enlarge: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    //var imgList = event.currentTarget.dataset.list;//获取data-list中的数组格式
    var ImgObject = event.currentTarget.dataset.list; //获取data-list中的对象，下一步再转换成数组
    // 对象转成数组方式一
    var imgList = []
    for (let i in ImgObject) {
      imgList.push(ImgObject[i]);
    }
    console.log(imgList);

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },
  //复制下载链接
  bvCopyDownLink(e) {
    var url = e.currentTarget.dataset.link; //获取data-link中的值
    // var url=this.data.url;
    wx.setClipboardData({
      data: url,
      success: function (res) {
        wx.hideToast();
        // self.setData({copyTip:true}),
        wx.showModal({
          title: '提示',
          content: '该文件下载链接已复制到剪贴板，请打开手机浏览器，在手机浏览器地址栏中粘贴下载链接并下载、保存文件',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })

      }
    })
  },
  bvReply(e) {
    console.log(e.currentTarget.dataset.id)
    const that = this;
    // 判断是否重复提交
    if (this.data.replylock) {
      // 锁定时很执行
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      // 未锁定时执行
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'ProductQAUpdate',
        // 传递给云函数的参数
        data: {
          id: e.currentTarget.dataset.id,
          answer: that.data.answer,
          status: "onshow",
          updatedate: new Date().toLocaleDateString()
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '回复信息发送成功',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        },
      })

      this.data.replylock = true // 修改上传状态为锁定
      wx.cloud.callFunction({
        // 要调用的云函数名称
        name: 'SendReply',
        // 传递给云函数的参数
        data: {
          openid: e.currentTarget.dataset.openid,
          date6: e.currentTarget.dataset.adddate,
          thing4: e.currentTarget.dataset.question,
          thing2: this.data.answer,
          name1: "小税宝客服"
        },
        success: res => {
          console.log(res)
          wx.showToast({
            title: '订阅消息发送成功',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        },
        fail: err => {
          console.log(err)
          // handle error
        },
      })
    }
  },
  bvUnlock(e) {
    this.setData({
      replylock: false
    })
  },
  bvSubmit(e) {
    // 判断是否重复提交
    if (this.data.sublock) {
      // 锁定时很执行
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      // 未锁定时执行
      // 获取数据库引用
      const db = wx.cloud.database()
      db.collection('PRODUCTQA').add({
          data: {
            DataId: this.data.pageParam.productid,
            ProductId: this.data.pageParam.productid,
            Question: this.data.question,
            Status: "",
            AddDate: new Date().toLocaleDateString()
          },
          success(res) {
            console.log('留言发送成功', res.data)
            wx.showToast({
              title: '留言发送成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })
            var tempmobile = [18954744612]
            // 调用云函数发短信给推荐人和管理员
            wx.cloud.callFunction({
              name: 'sendsms',
              data: {
                templateId: "1569089",
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
          },
          fail(res) {
            console.log("留言发送失败", res)
            wx.showToast({
              title: '留言发送失败',
              icon: 'none',
              duration: 2000 //持续的时间
            })
          }
        }),
        this.data.sublock = true // 修改上传状态为锁定
      wx.requestSubscribeMessage({
        tmplIds: ['tXhFEK36Dqkasd9Cmmuh5EKZ6LZycrWfgn4xqBreQz4'],
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
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

        console.log(app.globalData.Ginviter)

      },
    })
  },
  onLoad: function (options) {
    var that = this;
    console.log("页面接收参数", options)
    console.log("Gproduct", app.globalData.Gproduct)
    this.setData({
      pageParam: options,
    })
    if (app.globalData.Guserinfo == undefined) {
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
    }
    //判断全局变量是否有值，注意写法格式没有引号
    if (app.globalData.Gproduct == undefined) {
      //如果通过分享链接进入没有产品数据，则查询产品数据
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
          console.log(app.globalData.Gproduct)
        }
      })
    } else {
      // 筛选指定记录
      var fliter = [];
      // var _this = this
      for (var i = 0; i < app.globalData.Gproduct.length; i++) {
        if (app.globalData.Gproduct[i]._id == this.data.pageParam.productid) {
          fliter.push(app.globalData.Gproduct[i]);
        }
      }
      console.log(fliter);
      this.setData({
        product: fliter[0],
        swiperData: fliter[0].ProductImage
      })
      // 云函数查询商品的QA内容
      wx.cloud.callFunction({
        name: "NormalQuery",
        data: {
          collectionName: "PRODUCTQA",
          command: "and",
          where: [{
            DataId: this.data.pageParam.productid
          }]
        },
        success: res => {
          console.log(res)
          this.setData({
            qaarray: res.data
          })
        }
      })
    }
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
    this.setData({
      // usertype: app.globalData.Gtradeinfo.UserType,
      discountlevel: app.globalData.Gtradeinfo.DiscountLevel,
      userphone: app.globalData.Guserinfo.UserPhone,
    })

  },
  bvNewOrder(e) {
    console.log(e.currentTarget.dataset.params);
    wx.navigateTo({
      url: "../order/neworder?" + e.currentTarget.dataset.params
    })
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.Guserinfo.nickName + '推荐给您：',
      path: '/pages/product/productdetail?userid=' + app.globalData.Gopenid + '&productid=' + this.data.pageParam.productid,
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
  },


})