const app = getApp()
const utils = require("../../utils/utils")
var Time=require("../../utils/getDates")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 初始化相关
    params: {},
    tempinviterid: "",
    remark: "",
    // 登录框相关变量
    loginshow: false,
    loginbtnshow: false,
    time: "获取验证码",
pagelink:"", //为管理员提供当前页面产品链接
    //通过对页面内容分区域设置隐藏，达到分栏显示效果,hidden要反着写，显示的值为false,不显示的值为true
    DetailShow: true,
    QAShow: false,
    AttachmentShow: false,
    pageParam: [],
    productid: "",
    usertype: "client",
    discountlevel: "",
    product: [],
    array: [],
    qaarray: [],
    question: "",
    answer: "",
    sublock: false,
    replylock: false,
    tempimage: [],
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
  bvLoginShow: function (e) {
    this.setData({
      loginshow: true
    })
  },

  onLogin(e){
    this.setData({
      loginshow:e.detail.loginshow,
      loginbtnshow:e.detail.loginbtnshow,
      userphone:e.detail.userphone,
    })
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
      DetailShow: true,
      QAShow: false,
      AttachmentShow: false,
    })
  },
  bvQAView() {
    this.setData({
      DetailShow: false,
      QAShow: true,
      AttachmentShow: false,
    })
  },
  bvAttachmentView() {
    this.setData({
      DetailShow: false,
      QAShow: false,
      AttachmentShow: true,
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
  //   下载文件
  bvDownLoad(e){
    wx.showLoading({
        title: '下载中',
      });
      let fileId=e.currentTarget.dataset.link
      console.log("下载文件：",fileId);
      wx.cloud.downloadFile({
        fileID: fileId,
        success: (result) => {
          console.log("下载成功",result.tempFilePath);
          utils._SuccessToast("下载成功")
          const filePath = result.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
        },
        fail: (res) => {
          console.log("下载失败：",res);
          utils._ErrorToast("下载失败")
        },
        complete: (res) => {
          wx.hideLoading();
        },
      })
},
  async bvReply(e) {
    
    console.log(e.currentTarget.dataset.id)
    const that = this;
    // 判断是否重复提交
    if (this.data.replylock) {
      // 锁定时很执行
      utils._ErrorToast("请勿重复提交")

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
          updatedate:Time.getCurrentTime(),
        },
        success: res => {
          console.log(res)
          utils._SuccessToast("信息发送成功")
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
          utils._SuccessToast("消息发送成功")
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
  async bvSubmit(e) {
    
    // 判断是否重复提交
    if (this.data.sublock) {
      // 锁定时很执行
      utils._ErrorToast("请勿重复提交")

    } else {
      // 未锁定时执行
      // 获取数据库引用
      const db = wx.cloud.database()
      db.collection('PRODUCTQA').add({
          data: {
            DataId: this.data.pageParam.productid,
            ProductId: this.data.pageParam.productid,
            Question: this.data.question,
            Status: "unchecked",
            AddDate:Time.getCurrentTime(),
            From:"小税宝",
          },
          success: res => {
            console.log('留言发送成功', res.data)
            utils._SuccessToast("留言发送成功")
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
          fail: res => {
            console.log("留言发送失败", res)
            utils._ErrorToast("留言发送失败")
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

  _productfliter() {
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
  },
  _productQA() {
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
  },
  bvCopy: function (e) {
    wx.setClipboardData({
      data: this.data.pagelink, //这个是要复制的数据
      success: res => {
        utils._SuccessToast("已复制")
      }
    })
  },
  bvHongbao: function (e) {
    wx.navigateTo({
        url: "../product/productdetail?" + e.currentTarget.dataset.params
      })
  },
  onLoad: async function (options) {
    console.log("页面接收参数", options)
    let page=getCurrentPages().pop()
    console.log(page)
    this.setData({
      image:app.globalData.Gimagearray,
      pageParam: options,
      pagelink:"/"+page.route+'?productid='+options.productid
    })
    wx.showLoading({
      title: '加载中',
    })
    //如果通过分享链接进入没有产品数据，则查询产品数据
    if (app.globalData.Gproduct == undefined) {
      await utils._productcheck()
    }

    if (options.userid) {
      // 如果是通过链接打开
      this.data.params = options
      this.data.tempinviterid = options.userid
      this.data.remark = "通过小税宝用户分享链接进入"
      console.log("通过链接打开接收到的参数", this.data.tempinviterid)
      await utils.UserLogon(this.data.tempinviterid, this.data.params, this.data.remark)
    }
    this._productfliter()
    this._productQA()
    this.setData({
      usertype: app.globalData.Guserdata.UserInfo.UserType,
      discountlevel: app.globalData.Guserdata.TradeInfo.DiscountLevel,
    })
    wx.hideLoading()
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
      title: app.globalData.Guserdata.UserInfo.nickName + '推荐给您：',
      path: '/pages/product/productdetail?userid=' + app.globalData.Guserid + '&productid=' + this.data.pageParam.productid,
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
    /**
   * 分享到朋友圈
   * 前提是必须定义了：﻿onShareAppMessage，传参是在query中定义
   * 这个方法中分享的地址就是当前页面地址，所以不需要指定path
   */
  onShareTimeline: function (res) {
    console.log(this.data.swiperData[0])
  return {
    title: this.data.product.ProductName,
    query: 'userid=' + app.globalData.Guserid + '&productid=' + this.data.pageParam.productid,
    imageUrl: this.data.swiperData[0], //封面
  }
}

})