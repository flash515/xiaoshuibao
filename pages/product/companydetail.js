const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageParam: [],
    usertype: "",
    procudtarray: [],
    procudtdetail: [],
    array: [],
    qaarray: [],
    question: "",
    answer: "",
    sublock: false,
    replylock: false,
    avatarUrl:"",
    nickName:"",
    // 轮播参数
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0
  },
  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: "登录小税宝以查看更多信息",
      success: res => {
        console.log("获得的用户微信信息", res)
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName
        })
        app.globalData.GavatarUrl=res.userInfo.avatarUrl
        app.globalData.GnickName=res.userInfo.nickName
        // 获取数据库引用
        const db = wx.cloud.database()
        // 更新数据
        db.collection('USER').where({
          _openid: app.globalData.Gopenid
        }).update({
          data: {
            avatarUrl: res.userInfo.avatarUrl,
            city: res.userInfo.city,
            country: res.userInfo.country,
            gender: res.userInfo.gender,
            language: res.userInfo.language,
            nickName: res.userInfo.nickName,
            province: res.userInfo.province
          },
        })
        // 以上更新数据结束
        wx.showToast({
          icon:'success',
          title: '登录成功',
        })
        return;
      },
      fail: res => {
        //拒绝授权
        wx.showToast({
          icon: 'error',
          title: '您拒绝了请求',
        })
        return;
      }
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
        // self.setData({copyTip:true}),
        wx.hideToast();
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
            Produce_id: this.data.pageParam._id,
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
  bvNewOrder(e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../order/newcompany?' + e.currentTarget.dataset.id
    })
  },
  //打印合同，下载合同Word 文件
  downloadWord() {
    var url = this.data.word_url
    wx.setClipboardData({
      data: url, //需要设置的内容,
      success: res => {
        wx.showModal({
          title: '提示',
          content: '复制链接成功，在浏览器中粘贴地址即可下载',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else if (res.cancel) {
              console.log('取消')
            }
          }
        })
      }
    });
  },
  //下载并打开文档(下载合同Word 文件、预览分享)
  bvDownload() {
    var url = 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/omLS75Xib_obyxkVAahnBffPytcA/product/indibusiness/%E5%8D%97%E6%98%8C%E4%B8%AA%E4%BD%93%E6%B3%A8%E5%86%8C.rar?sign=98395be22de9dfeaad860abdb5ec5d38&t=1621322191';
    var fileExt = url.substring(url.lastIndexOf(".") + 1).toLowerCase(); //文件后缀名
    var fileName = url.substring(url.lastIndexOf("/") + 1).toLowerCase(); //文件名+后缀
    //wx.env.USER_DATA_PATH:微信小程序提供的本地用户文件目录
    //下载文件，生成临时地址
    wx.downloadFile({
      url: url, // 下载资源的 url
      filePath: wx.env.USER_DATA_PATH + '/' + fileName, //指定文件下载后存储的路径（本地路径）(filePath放开手机没问题，开发者工具报超限错误)
      success: res => {
        console.log('downloadFile', res)
        var filePath = res.filePath

        wx.setClipboardData({
          data: url, //需要设置的内容,
          success: res => {
            wx.showModal({
              title: '提示',
              content: '下载成功！链接已复制，打开浏览器访问即可下载文件。也可以点击预览，从右上角菜单里选择发送给微信好友',
              cancelText: '关闭',
              confirmText: '预览',
              success: function (res) {
                if (res.confirm) {
                  console.log('确定')
                  // 打开文件
                  wx.openDocument({
                    filePath: filePath, //文件路径，可通过 downFile 获得,
                    fileType: fileExt,
                    showMenu: true, //	是否显示右上角菜单
                    success: res => {
                      console.log('打开文档成功')
                    }
                  });
                } else if (res.cancel) {
                  console.log('取消')
                }
              }
            })
          }
        });
      },
      fail: () => {},
      complete: () => {}
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      pageParam: options,
    })
    console.log("pageParam", this.data.pageParam._id);
    // 从本地存储中读取
    wx.getStorage({
      key: 'LProductList',
      success: res => {
        this.setData({
          productarray: res.data
        })
        console.log("产品数组", this.data.productarray) //Object {errMsg: "getStorage:ok", data: "value1"}
        // 筛选指定记录
        var fliter = [];
        // var _this = this
        for (var i = 0; i < this.data.productarray.length; i++) {
          if (this.data.productarray[i]._id == this.data.pageParam._id) {
            fliter.push(this.data.productarray[i]);
          }
        }
        console.log(fliter);
        this.setData({
          productdetail: fliter
        })
      },
    })
    // 查询产品的QA内容
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PRODUCTQA').where({
      Product_id: this.data.pageParam._id
    }).get({
      success: res => {
        console.log("查询QA结果", res);
        this.setData({
          qaarray: res.data
        })

      }
    })
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
      usertype: app.globalData.Gusertype,
      image:app.globalData.Gimagearray,
      avatarUrl: app.globalData.GavatarUrl,
      nickName: app.globalData.GnickName,
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
  onShareAppMessage: function () {

  }
})