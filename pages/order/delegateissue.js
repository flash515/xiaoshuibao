const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    enterprisearray: [],
    addressarray: [],
    //销货企业
    sellername: "",
    sellerid: "",
    selleraddress: "",
    sellerphone: "",
    sellerbank: "",
    sellerbankaccount: "",
    //购货企业
    buyername: "",
    buyerid: "",
    buyeraddress: "",
    buyerphone: "",
    buyerbank: "",
    buyerbankaccount: "",
    //开票信息
    // invoiceradiocurrent:"1%专票",
    invoicetype: "1%专票",
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
    attachmentview:[],
    attachmentimage:[],
    attachmentFile:[],
    //收件地址
    addressee: "",
    addresseephone: "",
    address: "",
    //页面参数
    sellerswitchChecked:true,
    buyerswitchChecked:true,
    addressswitchChecked: true,
    sellerdisable:true,
    buyerdisable:true,
    addressdisable:true,
    submitted: false,
    submitbtndisable: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({image:app.globalData.Gimagearray})
    // 读取本地暂存数据
    wx.getStorage({
      key: 'LTempDelegataIssue',
      success: res => {
        console.log("LTemp", res.data)
        if (!res.data) {} else {
          this.setData({
            imageuploadlock: res.data.imageuploadlock,
            // 开票人
            sellername: res.data.sellername,
            sellerid: res.data.sellerid,
            sellerphone: res.data.sellerphone,
            selleraddress: res.data.selleraddress,
            sellerbank: res.data.sellerbank,
            sellerbankaccount: res.data.sellerbankaccount,

            // 受票企业
            buyername: res.data.buyername,
            buyerid: res.data.buyerid,
            buyerphone: res.data.buyerphone,
            buyeraddress: res.data.buyeraddress,
            buyerbank: res.data.buyerbank,
            buyerbankaccount: res.data.buyerbankaccount,
            // 开票信息
            invoicetype:res.data.invoicetype,
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
            attachmentfile:res.data.attachmentfile,
            addressee: res.data.addressee,
            addresseephone: res.data.addresseephone,
            address: res.data.address,
            sellerswitchChecked: res.data.sellerswitchChecked,
            BuyerswitchChecked: res.data.BuyerswitchChecked,
            addressswitchChecked: res.data.addressswitchChecked,
            submitted: res.data.submitted,
            submitbtndisable: res.data.submitbtndisable
          })
        }
      }
    })
    // 云函数读取企业名单
    wx.cloud.callFunction({
      name: 'EnterpriseQuery',
      data: {
        userid: app.globalData.Gopenid,
      },
      success: res => {
        this.setData({
          enterprisearray: res.result.data
        })
        console.log("企业数组", res)
        console.log("企业数组", res.result.data)
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
  submitenable(e) {
    this.setData({
      submitbtndisable: false
    })
  },
  submitdisable(e) {
    this.setData({
      submitbtndisable: true
    })
  },
  sellerswitchChange(e) {
    if (e.detail.value == true) {
      this.setData({
        sellerdisable: true,
        sellerswitchChecked: true
      })
      wx.showToast({
        title: '已开启从常客名单中选取出票企业',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        sellerdisable: false,
        sellerswitchChecked: false
      })
      wx.showToast({
        title: '已关闭从常客名单中选取出票企业',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  buyerswitchChange(e) {
    if (e.detail.value == true) {
      this.setData({
        buyerdisable: true,
        buyerswitchChecked: true
      })
      wx.showToast({
        title: '已开启从常客名单中选取受票企业',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        buyerdisable: false,
        buyerswitchChecked: false
      })
      wx.showToast({
        title: '已关闭从常客名单中选取受票企业',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }

  },
  addressswitchChange(e) {
    if (e.detail.value == true) {
      this.setData({
        addressdisable: true,
        addressswitchChecked: true
      })
      wx.showToast({
        title: '已开启从常客名单中选取邮寄地址',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        addressdisable: false,
        addressswitchChecked: false
      })
      wx.showToast({
        title: '已关闭从常客名单中选取邮寄地址',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  bindPickerSeller(e) {
    this.setData({
      sellername: this.data.enterprisearray[e.detail.value].EnterpriseName,
      sellerid: this.data.enterprisearray[e.detail.value].EnterpriseId,
      sellerphone: this.data.enterprisearray[e.detail.value].EnterprisePhone,
      selleraddress: this.data.enterprisearray[e.detail.value].EnterpriseAddress,
      sellerbank: this.data.enterprisearray[e.detail.value].EnterpriseBank,
      sellerbankaccount: this.data.enterprisearray[e.detail.value].EnterpriseAccount
    })
  },
  bindPickerBuyer(e) {
    this.setData({
      buyername: this.data.enterprisearray[e.detail.value].EnterpriseName,
      buyerid: this.data.enterprisearray[e.detail.value].EnterpriseId,
      buyerphone: this.data.enterprisearray[e.detail.value].EnterprisePhone,
      buyeraddress: this.data.enterprisearray[e.detail.value].EnterpriseAddress,
      buyerbank: this.data.enterprisearray[e.detail.value].EnterpriseBank,
      buyerbankaccount: this.data.enterprisearray[e.detail.value].EnterpriseAccount
    })
  },
  bindPickerAddress(e) {
    this.setData({
      addressee: this.data.addressarray[e.detail.value].Addressee,
      addresseephone: this.data.addressarray[e.detail.value].AddresseePhone,
      address: this.data.addressarray[e.detail.value].Address
    })
  },
  bvSellerName(e) {
    this.setData({
      sellername: e.detail.value
    })
  },
  bvSellerId(e) {
    this.setData({
      sellerid: e.detail.value
    })
  },
  bvSellerAddress(e) {
    this.setData({
      selleraddress: e.detail.value
    })
  },
  bvSellerPhone(e) {
    this.setData({
      sellerphone: e.detail.value
    })
  },
  bvSellerBank(e) {
    this.setData({
      sellerbank: e.detail.value
    })
  },
  bvSellerAccount(e) {
    this.setData({
      sellerbankaccount: e.detail.value
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
      buyerbankaccount: e.detail.value
    })
  },
  bvInvoiceChange(e) {
    console.log(e.detail)
    console.log(e.detail.key)

    this.setData({
      // invoiceradiocurrent:e.detail.key,
      invoicetype: e.detail.key
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
      totalfee: (e.detail.value * this.data.clientcountprice).toFixed(2),
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
        title: "请先填写开票企业名称后再尝试上传照片",
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
          const cloudPath = app.globalData.Gopenid + '/order/delegateissue/' + this.data.sellername + '/' + this.data.sellername + 'ORDER' + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
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
  bvTempStorage() {
    wx.setStorage({
      key: 'LTempDelegataIssue',
      data: {
        //销货企业
        sellername: this.data.sellername,
        sellerid: this.data.sellerid,
        selleraddress: this.data.selleraddress,
        sellerphone: this.data.sellerphone,
        sellerbank: this.data.sellerbank,
        sellerbankaccount: this.data.sellerbankaccount,
        //购货企业
        buyername: this.data.buyername,
        buyerid: this.data.buyerid,
        buyeraddress: this.data.buyeraddress,
        buyerphone: this.data.buyerphone,
        buyerbank: this.data.buyerbank,
        buyerbankaccount: this.data.buyerbankaccount,
        //开票信息
        invoicetype:this.data.invoicetype,
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
        servicesfee: this.data.servicesfee,
        totalfee: this.data.totalfee,
        charge1: this.data.charge1,
        charge2: this.data.charge2,
        invoremark: this.data.invoremark,
        remark: this.data.remark,
        attachmentview:this.data.attachmentview,
        attachmentimage:this.data.attachmentimage,
        attachmentfile:this.data.attachmentfile,
        addressee: this.data.addressee,
        addresseephone: this.data.addresseephone,
        address: this.data.address,
        sellerswitchChecked: this.data.sellerswitchChecked,
        BuyerswitchChecked: this.data.BuyerswitchChecked,
        addressswitchChecked: this.data.addressswitchChecked,
        submitted: this.data.submitted,
        submitbtndisable: this.data.submitbtndisable
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
      db.collection("DELEGATEISSUE").add({
          data: {
            SellerName: this.data.sellername,
            SellerId: this.data.sellerid,
            SellerAddress: this.data.selleraddress,
            SellerPhone: this.data.sellerphone,
            SellerBank: this.data.sellerbank,
            SellerBankAccount: this.data.sellerbankaccount,
            //购货企业
            BuyerPhone: this.data.buyerphone,
            BuyerAddress: this.data.buyeraddress,
            BuyerBank: this.data.buyerbank,
            BuyerBankAccount: this.data.buyerbankaccount,
            BuyerName: this.data.buyername,
            BuyerId: this.data.buyerid,
            //开票信息
            InvoiceType:this.data.invoicetype,
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
            Invoremark: this.data.invoremark,
            Remark: this.data.remark,
            AttachmentImage:this.data.attachmentimage,
            AttachmentFile:this.data.attachmentfile,
            Addressee: this.data.addressee,
            Addresseephone: this.data.addresseephone,
            Address: this.data.address,
            SysAddDate: new Date().getTime(),
            AddDate: new Date().toLocaleDateString(),
            PaymentStatus:"unchecked",
            OrderStatus:"unchecked",
          },
          success(res) {
            console.log('新增数据成功', res)
            thispage.setData({
              submitted: true // 修改上传状态并返回前端
            })
            console.log('thispage', thispage.data.submitted)
            console.log('this', this.data.submitted)
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
          key: 'LTempDelegateIssue',
          success(res) {
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