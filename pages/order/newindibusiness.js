const app = getApp()
Page({

  data: {
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
    nextMargin: 0,
    // 传入的参数
    pageParam: "",
    //新增数据变量
    // 产品编号
    productid: "",
    // 产品名称
    productname: "",
    // 办理地点
    issuedplace: "",
    // 订单费用标准（根据客户身份赋值）
    clientprice: "",
    // 订单费用计算标准（根据客户身份赋值）
    clientcountprice: 0,
    investorname: "",
    investorphone: "",
    investoraddress: "",
    investoremail: "",
    businessname: "",
    alternatename: "",
    businessscope: "",
    investment: "",
    // 净服务费，自动计算
    servicesfee: 0,
    // 总办理费用，自动计算
    totalfee: 0,
    // 直接推荐人，自动计算
    charge1: 0,
    // 间接推荐人，自动计算
    charge2: 0,
    sublock: false,
    attachmentview: [], //本地临时地址
    attachmentimage: [],
    imageuploadlock: false,
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
  onShow: function () {
    this.setData({
      image:app.globalData.Gimagearray,
      avatarUrl: app.globalData.GavatarUrl,
      nickName: app.globalData.GnickName,
    })
  },
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数

    this.setData({
      pageParam: options,
      productid: options.productid,
      productname: options.productname,
      issuedplace: options.issuedplace,
    })
    // 从本地存储中读取客户价格
    wx.getStorage({
      key: 'LProductList',
      success: res => {
        console.log("产品数组", res.data)
        // 筛选指定记录
        var fliter = [];
        // var _this = this
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].ProductId == this.data.pageParam.productid) {
            fliter.push(res.data[i]);
          }
        }
        console.log(fliter);
        if (app.globalData.Gpricelevel == 'PL1') {
          this.setData({
            clientcountprice: fliter[0].Price1Count,
            clientprice: fliter[0].Price1
          })
        }
        if (app.globalData.Gpricelevel == 'PL2') {
          this.setData({
            clientcountprice: fliter[0].Price2Count,
            clientprice: fliter[0].Price2
          })
        }
        if (app.globalData.Gpricelevel == 'PL3') {
          this.setData({
            clientcountprice: fliter[0].Price3Count,
            clientprice: fliter[0].Price3
          })
        }
        if (app.globalData.Gpricelevel == 'PL4') {
          this.setData({
            clientcountprice: fliter[0].Price4Count,
            clientprice: fliter[0].Price4
          })
        }
        console.log("客户价格", this.data.clientprice)
        console.log("客户计算价格", this.data.clientcountprice)
      },
    })
    // 读取本地暂存数据

    wx.getStorage({
      key: 'LTemp' + options.productid,
      success: res => {
        console.log("LTemp", res.data)
        if (!res.data) {} else {
          this.setData({
            imageuploadlock: res.data.imageuploadlock,
            //投资人
            investorname: res.data.investorname,
            investorphone: res.data.investorphone,
            investoraddress: res.data.investoraddress,
            investoremail: res.data.investoremail,
            //注册信息
            businessname: res.data.businessname,
            alternatename: res.data.alternatename,
            businessscope: res.data.businessscope,
            investment: res.data.investment,
            //附件
            attachmentview: res.data.attachmentview,
            attachmentimage: res.data.attachmentimage,
            // 收件地址
            addressee: res.data.addressee,
            address: res.data.address,
            addresseephone: res.data.addresseephone,
            //费用
            fee: res.data.fee,
            totalfee: res.data.totalfee,
            charge1: res.data.charge1,
            charge2: res.data.charge2,
          })
        }
      }
    })
  },
  bvInvestorName(e) {
    this.setData({
      investorname: e.detail.value,
    })
  },
  bvInvestorPhone(e) {
    this.setData({
      investorphone: e.detail.value
    })
  },
  bvInvestorAddress(e) {
    this.setData({
      investoraddress: e.detail.value
    })
  },
  bvInvestorEmail(e) {
    this.setData({
      investoremail: e.detail.value
    })
  },
  // 新增事件变量赋值
  bvBusinessName(e) {
    this.setData({
      businessname: e.detail.value
    })
  },
  bvAlternateName(e) {
    this.setData({
      alternatename: e.detail.value
    })
  },
  bvBusinessScope(e) {
    this.setData({
      businessscope: e.detail.value
    })
  },
  bvInvestment(e) {
    this.setData({
      investment: e.detail.value
    })
  },
  bvAddressee(e) {
    this.setData({
      addressee: e.detail.value
    })
  },
  bvAddress(e) {
    this.setData({
      address: e.detail.value
    })
  },
  bvAddresseePhone(e) {
    this.setData({
      addresseephone: e.detail.value
    })
  },
  onChangeImgTap(e) {
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  onRemoveImage(e) {
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  // 上传图片
  onUploadImage(e) {
    // 判断investorname是否空值
    if (this.data.investorname == "" || this.data.investorname == null) {
      wx.showToast({
        title: "请先填写开票人姓名后再尝试上传照片",
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
        for (let i = 0; i < this.data.attachmentview.length; i++) {
          const filePath = this.data.attachmentview[i]
          const cloudPath = app.globalData.Gopenid + '/order/indibusiness/' + this.data.investorname + '/' + this.data.investorname + 'ORDER' + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log("fileID", res.fileID)
              this.data.attachmentimage = this.data.attachmentimage.concat(res.fileID)
            }
          })
        }
        this.data.imageuploadlock = true // 修改上传状态为锁定
      }
      console.log("attachmentimage", this.data.attachmentimage)
      // 异步上传，打印idphotos时尚未返回数据
    }
  },
  bvTempStorage() {
    wx.setStorage({
      key: 'LTemp' + this.data.productid,
      data: {
        imageuploadlock: this.data.imageuploadlock,
        //投资人
        investorname: this.data.investorname,
        investorphone: this.data.investorphone,
        investoraddress: this.data.investoraddress,
        investoremail: this.data.investoremail,
        businessname: this.data.businessname,
        alternatename: this.data.alternatename,
        businessscope: this.data.businessscope,
        investment: this.data.investment,
        //附件
        attachmentview: this.data.attachmentview,
        attachmentimage: this.data.attachmentimage,
        // 收件地址
        addressee: this.data.addressee,
        address: this.data.address,
        addresseephone: this.data.addresseephone,
        //费用
        fee: this.data.fee,
        totalfee: this.data.totalfee,
        charge1: this.data.charge1,
        charge2: this.data.charge2,
      }
    })
    wx.showToast({
      title: '信息已保存',
      icon: 'none',
      duration: 2000 //持续的时间
    })
  },
  //跳转注册资料页面
  onClick: function () {
    wx.navigateTo({
      url: 'https://sm758rc5kj.jiandaoyun.com/f/5c221c18326ce11b6be21cca',
    })
  },
  // 异步新增数据方法
  addData() {
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
      // 新增数据
      db.collection("ORDER").add({
          data: {
            ProductId: this.data.productid,
            ProductName: this.data.productname,
            IssuedPlace: this.data.issuedplace,
            ClientCountPrice: this.data.clientcountprice,
            ClientPrice: this.data.clientprice,

            BusinessName: this.data.businessname,
            AlternateNam: this.data.alternatename,
            BusinessScope: this.data.businessscope,
            Investment: this.data.investment,

            InvestorName: this.data.investorname,
            InvestorPhone: this.data.investorphone,
            InvestorAddress: this.data.investoraddress,
            InvestorEmail: this.data.investoremail,
            //附件
            AttachmentImage: this.data.attachmentimage,
            // 收件地址
            Addressee: this.data.addressee,
            Address: this.data.address,
            AddresseePhone: this.data.addresseephone,
            //费用
            Fee: this.data.fee,
            TotalFee: this.data.totalfee,
            Charge1: this.data.charge1,
            Charge2: this.data.charge2,

            SysAddDate: new Date().getTime(),
            AddDate: new Date().toLocaleDateString()
          },
          success(res) {
            console.log('新增数据成功', res.data)
            wx.showToast({
              title: '新增数据成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })
          },
          fail(res) {
            console.log("新增数据失败", res)
            wx.showToast({
              title: '新增数据失败',
              icon: 'fail',
              duration: 2000 //持续的时间
            })
          }
        }),
        // 以上新增数据结束
        wx.removeStorage({
          key: 'LTemp' + this.data.productid,
          complete(res) {
            console.log("删除缓存", res)
          }
        })
      this.data.sublock = true // 修改上传状态为锁定
    }
  },
  pay() {
    wx.navigateTo({
      url: 'pay'
    })
  }
})