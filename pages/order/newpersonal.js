const app = getApp()
Page({

  data: {
    avatarUrl: "",
    nickName: "",
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
    sellerarray: [],
    buyerarray: [],
    addressarray: [],
    // 产品编号
    productid: "",
    // 产品名称
    productname: "",
    // 办理地点
    issuedplace: "",
    // 订单费用标准（根据客户身份赋值）
    orderprice: "",
    // 订单费用计算标准（根据客户身份赋值）
    orderpricecount: 0,
    sellername: "",
    sellerphone: "",
    selleraddress: "",
    sellertaxaccount: "",
    sellertaxpassword: "",

    buyername: "",
    buyerid: "",
    buyerphone: "",
    buyeraddress: "",
    buyerbank: "",
    buyerbankaccount: "",
    // 开票品名项目
    itemname: "",
    // 开票品名型号
    itemmodel: "",
    // 计量单位
    itemunit: "",
    // 数量
    quantity: 1,
    // 单价，自动计算
    unitprice: 0,
    // 总价（不含增值税），自动计算
    totalprice: 0,
    // 总价/开票总额（含增值税）
    totalamount: 0,
    // 增值税，自动计算
    vat: 0,
    // 增值税，自动计算
    supertax: 0,
    // 个人所得税，自动计算
    inditax: 0,
    // 净服务费，自动计算
    servicesfee: 0,
    // 总办理费用，自动计算
    totalfee: 0,
    // 直接推荐人，自动计算
    charge1: 0,
    // 间接推荐人，自动计算
    charge2: 0,
    // 发票备注
    invoremark: "",
    // 业务备注
    remark: "",
    sublock: false,
    attachmentview: [], //本地临时地址
    attachment: [], //常客名单中的附件名
    attachmentimage: [], //上传后的网络地址
    imageuploadlock: false,
    docaddressee: "",
    docaddresseephone: "",
    docaddress: "",
    idaddressee: "",
    idaddresseephone: "",
    idaddress: "",
    sellerswitchChecked: true,
    buyerswitchChecked: true,
    address1switchChecked: true,
    address2switchChecked: true,
    sellerdisable: true,
    buyerdisable: true,
    address1disable: true,
    address2disable: true,
    sellerpickershow: true,
    buyerpickershow: true,
    address1pickershow: true,
    address2pickershow: true,
    submitted: false,
    btnhidden: true
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
        app.globalData.GavatarUrl = res.userInfo.avatarUrl
        app.globalData.GnickName = res.userInfo.nickName
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
          icon: 'success',
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
      image: app.globalData.Gimagearray,
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
            orderpricecount: fliter[0].Price1Count,
            orderprice: fliter[0].Price1
          })
        }
        if (app.globalData.Gpricelevel == 'PL2') {
          this.setData({
            orderpricecount: fliter[0].Price2Count,
            orderprice: fliter[0].Price2
          })
        }
        if (app.globalData.Gpricelevel == 'PL3') {
          this.setData({
            orderpricecount: fliter[0].Price3Count,
            orderprice: fliter[0].Price3
          })
        }
        if (app.globalData.Gpricelevel == 'PL4') {
          this.setData({
            orderpricecount: fliter[0].Price4Count,
            orderprice: fliter[0].Price4
          })
        }
        console.log("客户价格", this.data.orderprice)
        console.log("客户计算价格", this.data.orderpricecount)
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
            // 开票人
            sellername: res.data.sellername,
            sellerphone: res.data.sellerphone,
            selleraddress: res.data.selleraddress,
            sellertaxaccount: res.data.sellertaxaccount,
            sellertaxpassword: res.data.sellertaxpassword,
            attachmentview: res.data.attachmentview,
            // 受票企业
            buyername: res.data.buyername,
            buyerid: res.data.buyerid,
            buyerphone: res.data.buyerphone,
            buyeraddress: res.data.buyeraddress,
            buyerbank: res.data.buyerbank,
            buyerbankaccount: res.data.buyerbankaccount,
            // 开票信息
            itemname: res.data.itemname,
            itemmodel: res.data.itemmodel,
            itemunit: res.data.itemunit,
            quantity: res.data.quantity,
            unitprice: res.data.unitprice,
            totalprice: res.data.totalprice,
            totalamount: res.data.totalamount,
            vat: res.data.vat,
            supertax: res.data.supertax,
            inditax: res.data.inditax,
            fee: res.data.fee,
            totalfee: res.data.totalfee,
            charge1: res.data.charge1,
            charge2: res.data.charge2,
            invoremark: res.data.invoremark,
            remark: res.data.remark,
            // 附件
            attachmentview: res.data.attachmentview,
            attachmentimage: res.data.attachmentimage,
            // 收件地址
            docaddressee: res.data.docaddressee,
            docaddresseephone: res.data.docaddresseephone,
            docaddress: res.data.docaddress,
            idaddressee: res.data.idaddressee,
            idaddresseephone: res.data.idaddresseephone,
            idaddress: res.data.idaddress

          })
        }
      }
    })
    // 云函数读取seller
    wx.cloud.callFunction({
      name: 'IndividualQuery',
      data: {
        userid: app.globalData.Gopenid,
      },
      success: res => {
        this.setData({
          sellerarray: res.result.data
        })
        console.log("seller查询", res)
        console.log("seller查询", res.result.data)
      }
    })
    // 云函数读取buyer
    wx.cloud.callFunction({
      name: 'EnterpriseQuery',
      data: {
        userid: app.globalData.Gopenid,
      },
      success: res => {
        this.setData({
          buyerarray: res.result.data
        })
        console.log("buyer查询", res)
        console.log("buyer查询", res.result.data)
      }
    })
    // 云函数读取address
    wx.cloud.callFunction({
      name: 'AddressQuery',
      data: {
        userid: app.globalData.Gopenid,
      },
      success: res => {
        this.setData({
          addressarray: res.result.data
        })
        console.log("address查询", res)
        console.log("address查询", res.result.data)
      }
    })
  },

  changeTabs(e) {
    console.log(e.detail)
    if (e.detail.activeKey == "seven") {
      this.setData({
        btnhidden: false
      })
    } else {
      this.setData({
        btnhidden: true
      })
    }
  },

  sellerswitchChange(e) {
    if (e.detail.value == true) {
      this.setData({
        sellerdisable: true,
        sellerpickershow: true
      })
      wx.showToast({
        title: '已开启从常客名单中选取开票人',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        sellerdisable: false,
        sellerpickershow: false
      })
      wx.showToast({
        title: '已关闭从常客名单中选取开票人',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
    console.log("sellerdisable", this.data.sellerdisable)
    console.log("sellerpickershow", this.data.sellerpickershow)
  },

  buyerswitchChange(e) {
    console.log(e.detail.value)
    if (e.detail.value == true) {
      this.setData({
        buyerdisable: true,
        buyerpickershow: true
      })
      wx.showToast({
        title: '已开启从常客名单中选取受票企业',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        buyerdisable: false,
        buyerpickershow: false
      })
      wx.showToast({
        title: '已关闭从常客名单中选取受票企业',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
    console.log("buyerdisable", this.data.buyerdisable)
    console.log("buyerpickershow", this.data.buyerpickershow)
  },
  address1switchChange(e) {
    console.log(e.detail.value)
    if (e.detail.value == true) {
      this.setData({
        address1disable: true,
        address1pickershow: true
      })
      wx.showToast({
        title: '已开启从常客名单中选取邮寄地址',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        address1disable: false,
        address1pickershow: false
      })
      wx.showToast({
        title: '已关闭从常客名单中选取邮寄地址',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
    console.log("address1disable", this.data.address1disable)
    console.log("address1pickershow", this.data.address1pickershow)
  },
  address2switchChange(e) {
    console.log(e.detail.value)
    if (e.detail.value == true) {
      this.setData({
        address2disable: true,
        address2pickershow: true
      })
      wx.showToast({
        title: '已开启从常客名单中选取邮寄地址',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        address2disable: false,
        address2pickershow: false
      })
      wx.showToast({
        title: '已关闭从常客名单中选取邮寄地址',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
    console.log("address2disable", this.data.address2disable)
    console.log("address2pickershow", this.data.address2pickershow)
  },
  bindPickerSeller(e) {
    this.setData({
      sellername: this.data.sellerarray[e.detail.value].IndividualName,
      sellerphone: this.data.sellerarray[e.detail.value].IndividualPhone,
      selleraddress: this.data.sellerarray[e.detail.value].IndividualAddress,
      sellertaxaccount: this.data.sellerarray[e.detail.value].TaxAccount,
      sellertaxpassword: this.data.sellerarray[e.detail.value].TaxPassword,
    })
    for (let i = 0; i < this.data.sellerarray[e.detail.value].Attachment.length; i++) {
      wx.getImageInfo({
        //把图片地址转换为本地地址
        src: this.data.sellerarray[e.detail.value].Attachment[i],
        success: (res) => {
          this.setData({
            attachmentview: this.data.attachmentview.concat(res.path)
          })
          console.log("attachmentview", this.data.attachmentview)
        }
      })
    }
  },
  bindPickerBuyer(e) {
    this.setData({
      buyername: this.data.buyerarray[e.detail.value].EnterpriseName,
      buyerid: this.data.buyerarray[e.detail.value].EnterpriseId,
      buyerphone: this.data.buyerarray[e.detail.value].EnterprisePhone,
      buyeraddress: this.data.buyerarray[e.detail.value].EnterpriseAddress,
      buyerbank: this.data.buyerarray[e.detail.value].EnterpriseBank,
      buyerbankaccount: this.data.buyerarray[e.detail.value].EnterpriseAccount
    })
  },
  bindPickerAddress1(e) {
    this.setData({
      docaddressee: this.data.addressarray[e.detail.value].Addressee,
      docaddresseephone: this.data.addressarray[e.detail.value].AddresseePhone,
      docaddress: this.data.addressarray[e.detail.value].Address
    })
  },
  bindPickerAddress2(e) {
    this.setData({
      idaddressee: this.data.addressarray[e.detail.value].Addressee,
      idaddresseephone: this.data.addressarray[e.detail.value].AddresseePhone,
      idaddress: this.data.addressarray[e.detail.value].Address
    })
  },

  bvSellerName(e) {
    this.setData({
      sellername: e.detail.value
    })
  },

  bvSellerPhone(e) {
    this.setData({
      sellerphone: e.detail.value
    })
  },
  bvSellerAddress(e) {
    this.setData({
      selleraddress: e.detail.value
    })
  },
  bvSellerTaxAccount(e) {
    this.setData({
      sellertaxaccount: e.detail.value
    })
  },
  bvSellerTaxPassword(e) {
    this.setData({
      sellertaxpassword: e.detail.value
    })
  },
  bvBuyerName(e) {
    this.setData({
      buyername: e.detail.value
    })
  },
  bvBuyerId(e) {
    this.setData({
      buyerid: e.detail.value
    })
  },
  bvBuyerAddress(e) {
    this.setData({
      buyeraddress: e.detail.value
    })
  },
  bvBuyerPhone(e) {
    this.setData({
      buyerphone: e.detail.value
    })
  },
  bvBuyerBank(e) {
    this.setData({
      buyerbank: e.detail.value
    })
  },
  bvBuyerAccount(e) {
    this.setData({
      buyeraccount: e.detail.value
    })
  },
  bvItemName(e) {
    this.setData({
      itemname: e.detail.value
    })
  },
  bvItemModel(e) {
    this.setData({
      itemmodel: e.detail.value
    })
  },
  bvItemUnit(e) {
    this.setData({
      itemunit: e.detail.value
    })
  },
  bvQuantity(e) {
    this.setData({
      quantity: e.detail.value,
      unitprice: (this.data.totalamount / 1.01 / e.detail.value).toFixed(2),
    })
  },
  bvTotalAmount(e) {
    this.setData({
      totalamount: e.detail.value,
      totalprice: (e.detail.value / 1.01).toFixed(2),
      unitprice: (e.detail.value / 1.01 / this.data.quantity).toFixed(2),
      vat: (e.detail.value / 1.01 * 0.01).toFixed(2),
      inditax: (e.detail.value / 1.01 * 0.005).toFixed(2),
      totalfee: (e.detail.value * this.data.orderpricecount).toFixed(2),
    })
    // 附加税计算,潍坊适用
    if (e.detail.value < 100000) {
      this.setData({
        supertax: (e.detail.value / 1.01 * 0.01 * 0.035).toFixed(2)
      })
    } else {
      this.setData({
        supertax: (e.detail.value / 1.01 * 0.01 * 0.06).toFixed(2)
      })
    }
    this.setData({
      fee: (this.data.totalfee - this.data.vat - this.data.supertax - this.data.inditax).toFixed(2),
      charge1: (e.detail.value * 0.0008).toFixed(2),
      charge2: (e.detail.value * 0.0002).toFixed(2)
    })
  },

  bvInvoRemark(e) {
    this.setData({
      invoremark: e.detail.value
    })
  },
  bvRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },

  onChangeImgTap(e) {
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  onRemoveImage(e) {
    console.log("event.detail", e.detail)
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  // 上传图片
  onUploadImage(e) {
    // 判断sellername是否空值
    if (this.data.sellername == "" || this.data.sellername == null) {
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
          const cloudPath = app.globalData.Gopenid + '/order/personal/' + this.data.sellername + '/' + this.data.sellername + 'ORDER' + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
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
      // 异步上传，打印attachment时尚未返回数据
    }
  },
  bvDocAddressee(e) {
    this.setData({
      docaddressee: e.detail.value
    })
  },
  bvDocAddresseePhone(e) {
    this.setData({
      docaddresseephone: Number(e.detail.value)
    })
  },
  bvDocAddress(e) {
    this.setData({
      docaddress: e.detail.value
    })
  },
  bvIdAddressee(e) {
    this.setData({
      idaddressee: e.detail.value
    })
  },
  bvIdAddresseePhone(e) {
    this.setData({
      idaddresseephone: Number(e.detail.value)
    })
  },
  bvIdAddress(e) {
    this.setData({
      idaddress: e.detail.value
    })
  },
  bvTempStorage() {
    wx.setStorage({
      key: 'LTemp' + this.data.productid,
      data: {
        imageuploadlock: this.data.imageuploadlock,
        sellername: this.data.sellername,
        sellerphone: this.data.sellerphone,
        selleraddress: this.data.selleraddress,
        sellertaxaccount: this.data.sellertaxaccount,
        sellertaxpassword: this.data.sellertaxpassword,
        buyername: this.data.buyername,
        buyerid: this.data.buyerid,
        buyerphone: this.data.buyerphone,
        buyeraddress: this.data.buyeraddress,
        buyerbank: this.data.buyerbank,
        buyerbankaccount: this.data.buyerbankaccount,
        itemname: this.data.itemname,
        itemmodel: this.data.itemmodel,
        itemunit: this.data.itemunit,
        quantity: this.data.quantity,
        unitprice: this.data.unitprice,
        totalprice: this.data.totalprice,
        totalamount: this.data.totalamount,
        vat: this.data.vat,
        supertax: this.data.supertax,
        inditax: this.data.inditax,
        fee: this.data.fee,
        totalfee: this.data.totalfee,
        charge1: this.data.charge1,
        charge2: this.data.charge2,
        invoremark: this.data.invoremark,
        remark: this.data.remark,
        attachmentview: this.data.attachmentview,
        attachmentimage: this.data.attachmentimage,
        docaddressee: this.data.docaddressee,
        docaddresseephone: this.data.docaddresseephone,
        docaddress: this.data.docaddress,
        idaddressee: this.data.idaddressee,
        idaddresseephone: this.data.idaddresseephone,
        idaddress: this.data.idaddress
      }
    })
    wx.showToast({
      title: '信息已保存',
      icon: 'none',
      duration: 2000 //持续的时间
    })
  },

  // 异步新增数据方法
  addData() {
    // 多层嵌套的this需提前定义中转变量
    var thispage = this
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
      db.collection("DKORDER").add({
          data: {
            ProductId: this.data.productid,
            ProductName: this.data.productname,
            IssuedAddress: this.data.issuedaddress,
            OrderPrice: this.data.orderprice,
            OrderPriceCount: this.data.orderpricecount,

            SellerName: this.data.sellername,
            SellerPhone: this.data.sellerphone,
            SellerAddress: this.data.selleraddress,
            SellerTaxAccount: this.data.sellertaxaccount,
            SellerTaxPassword: this.data.sellertaxpassword,

            BuyerPhone: this.data.buyerphone,
            BuyerAddress: this.data.buyeraddress,
            BuyerBank: this.data.buyerbank,
            BuyerBankAccount: this.data.buyerbankaccount,
            BuyerName: this.data.buyername,
            BuyerId: this.data.buyerid,

            ItemName: this.data.itemname,
            ItemModel: this.data.itemmodel,
            ItemUnit: this.data.itemunit,
            Quantity: this.data.quantity,
            UintPrice: this.data.unitprice,
            TotalPrice: this.data.totalprice,
            TotalAmount: this.data.totalamount,
            Vat: this.data.vat,
            Supertax: this.data.supertax,
            Inditax: this.data.inditax,
            Fee: this.data.fee,
            TotalFee: this.data.totalfee,
            Charge1: this.data.charge1,
            Charge2: this.data.charge2,
            InvoRemark: this.data.invoremark,
            Remark: this.data.remark,

            AttachmentImage: this.data.attachmentimage,

            DocAddressee: this.data.docaddressee,
            DocAddresseePhone: this.data.docaddresseephone,
            DocAddress: this.data.docaddress,
            IdAddressee: this.data.idaddressee,
            IdAddresseePhone: this.data.idaddresseephone,
            IdAddress: this.data.idaddress,

            SysAddDate: new Date().getTime(),
            AddDate: new Date().toLocaleDateString(),
            PaymentStatus: "unchecked",
            OrderStatus: "unchecked",
          },
          success(res) {
            thispage.setData({
              submitted: true // 修改上传状态并返回前端
            })
            db.collection("PAYMENT").add({
              data: {
                ProductId: this.data.productid,
                ProductName: this.data.productname,
                IssuedPlace: this.data.issuedplace,
                TotalFee: this.data.totalfee,
                SysAddDate: new Date().getTime(),
                AddDate: new Date().toLocaleDateString(),
                PaymentStatus: "unchecked",
              },
              success(res) {
                wx.showToast({
                  title: '新增数据成功',
                  icon: 'success',
                  duration: 2000 //持续的时间
                })
              }
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
  pay(e) {
    wx.navigateTo({
      url: '../order/pay?' + e.currentTarget.dataset.totalfee
    })
  }
})