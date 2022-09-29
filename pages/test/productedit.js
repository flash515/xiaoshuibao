const app = getApp();
const placeArray = [
  {
    "Category1": "北京",
    "Category2Array": [{
      "Category2": "北京",
      "Category3Array": ["东城区", "西城区", "崇文区", "宣武区", "朝阳区", "丰台区", "石景山区", "海淀区", "门头沟区", "房山区", "通州区", "顺义区", "昌平区", "大兴区", "平谷区", "怀柔区", "密云县", "延庆县"]
    }]
  },

  {
    "Category1": "天津",
    "Category2Array": [
      {
        "Category2": "天津A",
        "Category3Array": ["a区", "b区", "c区", "d区", "e区"]
      },
      {
        "Category2": "天津B",
        "Category3Array": ["1区", "2区", "3区", "4区"]
      }
   ]
  },

  {
    "Category1": "河北",
    "Category2Array": [

      {
        "Category2": "石家庄",
        "Category3Array": ["长安区", "新乐市", "鹿泉市"]
      },

      {
        "Category2": "邯郸",
        "Category3Array": ["邯山区", "丛台区", "复兴区", "峰峰矿区", "邯郸县", "临漳县", "成安县", "大名县", "涉  县", "磁  县" ]
      },

      {
        "Category2": "邢台",
        "Category3Array": ["桥东区", "桥西区", "沙河市"]
      },
    ]
  }];
Page({
  data: {
    usertype: "",
    x: 0,
    // 传值参数
    recordid: "",
    pageParam: "",
    // 产品参数
    procudtarray: [], //通过查询功能得到的产品数组
    procudtdetail: [],
    array: [],
    category1: "",
    category2: "",
    category3: "",
    multiArray:placeArray,
    // https://www.csdn.net/tags/MtjaYg0sMDI2MzgtYmxvZwO0O0OO0O0O.html
    // multiArray: [['商务服务', '教培信息'], ['地址服务', '工商代办', '银行代办', '财税服务', '企业托管', '资质代办'], ['深圳地址', '广州地址', '东莞地址']],
    placeArray: placeArray,
    // province: placeArray[0].name,
    // pIndex: 0,
    // city: placeArray[0].city[0].name,
    // cIndex: 0,
    // area: placeArray[0].city[0].area[0],
    // aIndex: 0,
    sortArray:[],
    // objectMultiArray: [
    //   [
    //     {
    //       id: 0,
    //       name: '地址服务'
    //     },
    //     {
    //       id: 1,
    //       name: '工商代办'
    //     },
    //     {
    //       id: 2,
    //       name: '银行代办'
    //     },
    //     {
    //       id: 3,
    //       name: '财税服务'
    //     },
    //     {
    //       id: 4,
    //       name: '企业托管'
    //     },
    //     {
    //       id: 5,
    //       name: '资质代办'
    //     }
    //   ],
    //   [
    //     {
    //       id: 0,
    //       name: '语文'
    //     },
    //     {
    //       id: 1,
    //       name: '数学'
    //     }
    //   ]
    // ],
    multiIndex: [],

    // 表单参数
    showvalue1: true,
    showvalue2: true,
    showvalue3: true,
    showvalue4: true,
    showvalue5: true,
    showvalue6: true,
    showvalue7: true,
    showvalue8: true,
    showvalue9: false,
    showvalue10: false,
    showvalue11: true,
    showvalue12: false,
    showvalue13: false,
    showvalue14: false,
    showvalue15: true,
    showvalue16: true,
    showvalue17: true,
    showvalue18: true,
    showvalue19: true,
    showvalue20: true,
    showvalue21: true,
    showvalue22: true,
    showvalue23: true,
    showvalue24: true,
    showvalue25: true,
    showvalue26: true,
    showvalue27: true,
    adddate: "",
    productid: "",
    producttype: "",
    productname: "",
    outline: "",
    startdate: "",
    enddate: "",
    description: "",
    handleplace:["广东省","深圳市"],
    issuedby: "",
    situation: "",
    forbid: "",
    doclist: "",
    processingtime: "",
    provider: "",
    providerprice: "",
    price1: "",
    price2: "",
    price3: "",
    price4: "",
    providercountprice: 0,
    price1count: 0,
    price2count: 0,
    price3count: 0,
    price4count: 0,
    reward: "",
    rewardtime: "",
    startdate: "",
    enddate: "",
    updatedate: "",
    status: "",
    score: 0,
    attachmentview: [], //用于展示数据库中的图片
    attachmentimage: [], //数据库中的图片
    attachmentfile: {},
    tempFilePaths: [],
    onsalechecked: false,
    sublock: false,
    fileuploadlock: false,
    imageuploadlock: false,
    recordcontral: false
  },

  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    console.log(this.data.multiIndex);
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    // 联动
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['地址服务', '工商代办', '银行代办', '财税服务', '企业托管', '资质代办'];
            data.multiArray[2] = ['深圳地址', '广州地址', '东莞地址'];
            break;
          case 1:
            data.multiArray[1] = ['地址服务', '工商代办', '银行代办', '财税服务', '企业托管', '资质代办'];
            data.multiArray[2] = ['工商注册', '工商变更', '工商注销'];
            break;
          case 2:
            data.multiArray[1] = ['地址服务', '工商代办', '银行代办', '财税服务', '企业托管', '资质代办'];
            data.multiArray[2] = ['银行开户', '调整额度', '银行销户'];
            break;
          case 3:
            data.multiArray[1] = ['地址服务', '工商代办', '银行代办', '财税服务', '企业托管', '资质代办'];
            data.multiArray[2] = ['记账报税', '税种核定', '领票购票', '开票代办'];
            break;
          case 4:
            data.multiArray[1] = ['地址服务', '工商代办', '银行代办', '财税服务', '企业托管', '资质代办'];
            data.multiArray[2] = ['南昌托管', '西安托管', '明光托管'];
            break;
          case 5:
            data.multiArray[1] = ['地址服务', '工商代办', '银行代办', '财税服务', '企业托管', '资质代办'];
            data.multiArray[2] = ['食品经营许可证', '道路运输许可证'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['深圳地址', '广州地址', '东莞地址'];
                break;
              case 1:
                data.multiArray[2] = ['工商注册', '工商变更', '工商注销'];
                break;
              case 2:
                data.multiArray[2] = ['银行开户', '调整额度', '银行销户'];
                break;
              case 3:
                data.multiArray[2] = ['记账报税', '税种核定', '领票购票', '开票代办'];
                break;
              case 4:
                data.multiArray[2] = ['南昌托管', '西安托管', '明光托管'];
                break;
              case 5:
                data.multiArray[2] = ['食品经营许可证', '道路运输许可证'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;

    }
    this.setData(data);
    console.log(e.detail.value);
    this.setData({
      category1: data.multiArray[0][data.multiIndex[0]],
      category2: data.multiArray[1][data.multiIndex[1]],
      category3: data.multiArray[2][data.multiIndex[2]],
    })
    console.log(data);
    console.log(this.data.category1);
    console.log(this.data.category2);
    console.log(this.data.category3);
  },

  //查询本人创建且符合模糊条件的记录
  onSearch(e) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PRODUCT').where(_.and([{
      _openid: app.globalData.Gopenid
    },
    _.or([{
      IssuedBy: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    },
    {
      ProductType: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    },
    {
      Status: {
        $regex: '.*' + e.detail.value,
        $options: 'i'
      }
    }
    ])
    ])).get({
      success: res => {
        this.setData({
          productarray: res.data,
        })
        if (res.data.length > 1) {
          this.setData({
            recordcontral: true
          })
        }
        this.setcurrentdata()
      }
    })
  },
  onPreviousClick() {
    if (this.data.x == 0) {
      wx.showToast({
        title: '已经是第一条记录了',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.data.x = this.data.x - 1
      this.setcurrentdata()
    }
  },
  onNextClick() {
    if (this.data.x == this.data.productarray.length - 1) {
      wx.showToast({
        title: '已经是最后一条记录了',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.data.x = this.data.x + 1
      this.setcurrentdata()
    }
  },
  setcurrentdata() {
    this.setData({
      recordid: this.data.productarray[this.data.x]._id,
      adddate: this.data.productarray[this.data.x].AddDate,
      status: this.data.productarray[this.data.x].Status,
      productid: this.data.productarray[this.data.x].ProductId,
      producttype: this.data.productarray[this.data.x].ProductType,
      productname: this.data.productarray[this.data.x].ProductName,
      outline: this.data.productarray[this.data.x].Outline,
      startdate: this.data.productarray[this.data.x].StartDate,
      enddate: this.data.productarray[this.data.x].EndDate,
      description: this.data.productarray[this.data.x].Description,
      handleplace: this.data.productarray[this.data.x].HandlePlace,
      issuedby: this.data.productarray[this.data.x].IssuedBy,
      situation: this.data.productarray[this.data.x].Situation,
      forbid: this.data.productarray[this.data.x].Forbid,
      doclist: this.data.productarray[this.data.x].DocList,
      processingtime: this.data.productarray[this.data.x].ProcessingTime,
      reward: this.data.productarray[this.data.x].Reward,
      rewardtime: this.data.productarray[this.data.x].RewardTime,
      provider: this.data.productarray[this.data.x].Provider,
      providerprice: this.data.productarray[this.data.x].ProviderPrice,
      providercountprice: this.data.productarray[this.data.x].ProviderCountPrice,
      price1: this.data.productarray[this.data.x].Price1,
      price1count: this.data.productarray[this.data.x].Price1Count,
      price2: this.data.productarray[this.data.x].Price2,
      price2count: this.data.productarray[this.data.x].Price2Count,
      price3: this.data.productarray[this.data.x].Price3,
      price3count: this.data.productarray[this.data.x].Price3Count,
      price4: this.data.productarray[this.data.x].Price4,
      price4count: this.data.productarray[this.data.x].Price4Count,
      score: this.data.productarray[this.data.x].Score,
      updatedate: this.data.productarray[this.data.x].UpdateDate,
      attachmentimage: this.data.productarray[this.data.x].AttachmentImage,
      attachmentfilee: this.data.productarray[this.data.x].AttachmentFile,
    })
    if (this.data.productarray[this.data.x].Status == "在售") {
      this.setData({
        onsalechecked: true
      })
    } else {
      this.setData({
        onsalechecked: false
      })
    }
  },
  SVChange1(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue1: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue1: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange2(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue2: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue2: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange3(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue3: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue3: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange4(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue4: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue4: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange5(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue5: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue5: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange6(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue6: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue6: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange7(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue7: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue7: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange8(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue8: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue8: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange9(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue9: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue9: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange10(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue10: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue10: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange11(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue11: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue11: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange12(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue12: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue12: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange13(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue13: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue13: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange14(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue14: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue14: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange15(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue15: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue15: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange16(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue16: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue16: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange17(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue17: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue17: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange18(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue18: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue18: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange19(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue19: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue19: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange20(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue20: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue20: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange21(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue21: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue21: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange22(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue22: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue22: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange23(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue23: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue23: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange24(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue24: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue24: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange25(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue25: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue25: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange26(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue26: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue26: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },
  SVChange27(e) {
    if (e.detail.value == true) {
      this.setData({
        showvalue27: true
      })
      wx.showToast({
        title: '已开启展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        showvalue27: false
      })
      wx.showToast({
        title: '已关闭展示开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },

  onsaleChange(e) {
    if (e.detail.value == true) {
      this.setData({
        status: "在售",
        onsalechecked: true
      })
      wx.showToast({
        title: '已开启在售开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      this.setData({
        status: "停售",
        onsalechecked: false
      })
      wx.showToast({
        title: '已关闭在售开关',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    }
  },

  bvProductId(e) {
    this.setData({
      productid: e.detail.value
    })
  },
  // 通过事件绑定用户手机值
  bvProductName(e) {
    this.setData({
      productname: e.detail.value
    })
  },
  bvProductType(e) {
    this.setData({
      producttype: e.detail.value
    })
  },
  bvOutline(e) {
    this.setData({
      outline: e.detail.value
    })
  },
  // 通过事件绑定企业名称值
  bvStartDate(e) {
    this.setData({
      startdate: e.detail.value
    })
  },
  // 通过事件绑定企业名称值
  bvEndDate(e) {
    this.setData({
      enddate: e.detail.value
    })
  },
  bvDescription(e) {
    this.setData({
      description: e.detail.value
    })
  },
  bindPlaceChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      handleplace: [e.detail.value[0],e.detail.value[1]]
    })
    console.log('picker发送选择改变，携带值为', this.data.handleplace)
  },
  bvIssuedBy(e) {
    this.setData({
      issuedby: e.detail.value
    })
  },
  bvSituation(e) {
    this.setData({
      situation: e.detail.value
    })
  },
  // 通过事件绑定企业名称值
  bvProcessingTime(e) {
    this.setData({
      processingtime: e.detail.value
    })
  },
  bvDocList(e) {
    this.setData({
      doclist: e.detail.value
    })
  },
  bvForbid(e) {
    this.setData({
      forbid: e.detail.value
    })
  },
  bvProvider(e) {
    this.setData({
      provider: e.detail.value
    })
  },
  bvProviderPrice(e) {
    this.setData({
      providerprice: e.detail.value
    })
  },
  bvProviderCountPrice(e) {
    this.setData({
      providercountprice: e.detail.value
    })
  },
  bvPrice1(e) {
    this.setData({
      price1: e.detail.value
    })
  },
  bvPrice1Count(e) {
    this.setData({
      price1count: e.detail.value
    })
  },
  bvPrice2(e) {
    this.setData({
      price2: e.detail.value
    })
  },
  bvPrice2Count(e) {
    this.setData({
      price2count: e.detail.value
    })
  },
  bvPrice3(e) {
    this.setData({
      price3: e.detail.value
    })
  },
  bvPrice3Count(e) {
    this.setData({
      price3count: e.detail.value
    })
  },
  bvPrice4(e) {
    this.setData({
      price4: e.detail.value
    })
  },
  bvPrice4Count(e) {
    this.setData({
      price4count: e.detail.value
    })
  },
  bvReward(e) {
    this.setData({
      reward: e.detail.value
    })
  },
  bvRewardTime(e) {
    this.setData({
      rewardtime: e.detail.value
    })
  },
  bvChangeScore(e) {
    this.setData({
      score: e.detail.value
    })
  },
  onChangeTap(e) {
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvRemoveImage(e) {
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvUploadImage(e) {
    let that = this
    // 判断产品id是否空值
    if (this.data.productid == "" || this.data.productid == null) {
      wx.showToast({
        title: "请先填写开票人姓名后再尝试上传资料",
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
        if (this.data.attachmentview.length == 0) {
          this.data.attachmentimage = []
        } else {
          for (let i = 0; i < this.data.attachmentview.length; i++) {
            const filePath = this.data.attachmentview[i]
            const cloudPath = 'product/' + this.data.productid + '/' + this.data.productid + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log("fileID", res.fileID)
                this.data.attachmentimage = this.data.attachmentimage.concat(res.fileID)
              }
            })
          }

        }
        this.data.imageuploadlock = true // 修改上传状态为锁定
        console.log("attachmentimage", that.data.attachmentimage)
        // 异步上传，打印attachment时尚未返回数据
      }
    }
  },
  bvUploadFile(e) {
    // 判断individualname是否空值
    if (this.data.productid == "" || this.data.productid == null) {
      wx.showToast({
        title: "请先填写产品编号后再尝试上传资料",
        icon: 'none',
        duration: 2000
      })
    } else {
      // 判断是否重复提交
      if (this.data.fileuploadlock) {
        // 锁定时很执行
        wx.showToast({
          title: '请勿重复提交',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      } else {
        for (let i = 0; i < this.data.tempFilePaths.length; i++) {
          const filePath = this.data.tempFilePaths[i].path
          const cloudPath = 'product/' + this.data.productid + '/' + this.data.tempFilePaths[i].name
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              let str = String(this.data.tempFilePaths[i].name) //字符串，想要的是以下划线截取前后的字符
              let s = str.lastIndexOf('.') //找到最后一次出现点号的位置
              let filename = str.substring(0, s) //取点号前的字符
              console.log("filename", filename)
              var obj = new Object();
              obj = {
                [filename]: res.fileID
              }
              this.data.attachmentfile = Object.assign(this.data.attachmentfile, obj)
              wx.showToast({
                title: this.data.tempFilePaths[i].name + '上传成功',
                icon: 'none',
                duration: 2000 //持续的时间
              })
            }
          })
        }

        this.data.fileuploadlock = true // 修改上传状态为锁定
        console.log("attachmentfile", this.data.attachmentfile)
        // 异步上传，打印attachment时尚未返回数据
      }
    }

  },
  bvChooseFile(e) {
    wx.chooseMessageFile({
      count: 4,
      type: 'file',
      success: res => {
        console.log("res.tempFiles", res)
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          tempFilePaths: res.tempFiles
        })
      }
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
      db.collection("PRODUCT").add({
        data: {
          AddDate: new Date().toLocaleDateString(),
          Status: this.data.status,
          ProductId: this.data.productid,
          ProductType: this.data.producttype,
          ProductName: this.data.productname,
          Outline: this.data.outline,
          StartDate: this.data.startdate,
          EndDate: this.data.enddate,
          Description: this.data.description,
          HandlePlace: this.data.handleplace,
          IssuedBy: this.data.issuedby,
          Situation: this.data.situation,
          Forbid: this.data.forbid,
          DocList: this.data.doclist,
          ProcessingTime: this.data.processingtime,
          Reward: this.data.reward,
          RewardTime: this.data.rewardtime,
          Provider: this.data.provider,
          ProviderPrice: this.data.providerprice,
          ProviderCountPrice: this.data.providercountprice,
          Price1: this.data.price1,
          Price1Count: Number(this.data.price1count),
          Price2: this.data.price2,
          Price2Count: Number(this.data.price2count),
          Price3: this.data.price3,
          Price3Count: Number(this.data.price3count),
          Price4: this.data.price4,
          Price4Count: Number(this.data.price4count),
          Score: Number(this.data.score),
          AttachmentImage: this.data.attachmentimage,
          AttachmentFile: this.data.attachmentfile,
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
        this.data.sublock = true // 修改上传状态为锁定
    }
  },
  // 更新数据
  updateData() {
    // 获取数据库引用
    const db = wx.cloud.database()
    // 新增数据
    db.collection("PRODUCT").doc(this.data.recordid).update({
      data: {
        Status: this.data.status,
        ProductId: this.data.productid,
        ProductType: this.data.producttype,
        ProductName: this.data.productname,
        Outline: this.data.outline,
        StartDate: this.data.startdate,
        EndDate: this.data.enddate,
        Description: this.data.description,
        HandlePlace: this.data.handleplace,
        IssuedBy: this.data.issuedby,
        Situation: this.data.situation,
        Forbid: this.data.forbid,
        DocList: this.data.doclist,
        ProcessingTime: this.data.processingtime,
        Reward: this.data.reward,
        RewardTime: this.data.rewardtime,
        Provider: this.data.provider,
        ProviderPrice: this.data.providerprice,
        ProviderCountPrice: this.data.providercountprice,
        Price1: this.data.price1,
        Price1Count: this.data.price1count,
        Price2: this.data.price2,
        Price2Count: this.data.price2count,
        Price3: this.data.price3,
        Price3Count: this.data.price3count,
        Price4: this.data.price4,
        Price4Count: this.data.price4count,
        AttachmentImage: this.data.attachmentimage,
        AttachmentFile: this.data.attachmentfile,
        Score: this.data.score,
        UpdateDate: new Date().toLocaleDateString()
      },
      success(res) {
        console.log('更新数据成功', res)
        wx.showToast({
          title: '更新数据成功',
          icon: 'success',
          duration: 2000 //持续的时间
        })
        // 更新成功后重新查询本人的产品并存入本地
        db.collection('PRODUCT').where({
          _openid: app.globalData.Gopenid
        }).get({
          success: res => {
            wx.setStorageSync('LPersonalProduct', res.data)
            console.log(res)
          }
        })
      },
      fail(res) {
        console.log("更新数据失败", res)
        wx.showToast({
          title: '更新数据失败',
          icon: 'fail',
          duration: 2000 //持续的时间
        })
      }
    })
    // 以上更新数据结束
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    var that = this;
    this.setData({
      usertype: app.globalData.Gusertype,
      pageParam: options,
      recordid: options._id,
    })
    console.log("pageParam", this.data.pageParam._id);
    // 通过产品总览过来的页面适合从本地存储中读取
    wx.getStorage({
      key: 'LPersonalProduct',
      success: res => {
        this.setData({
          productarray: res.data
        })
        console.log("产品数组", this.data.productarray)
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
          productdetail: fliter,
          adddate: fliter[0].AddDate,
          status: fliter[0].Status,
          productid: fliter[0].ProductId,
          producttype: fliter[0].ProductType,
          productname: fliter[0].ProductName,
          outline: fliter[0].Outline,
          startdate: fliter[0].StartDate,
          enddate: fliter[0].EndDate,
          description: fliter[0].Description,
          handleplace: fliter[0].HandlePlace,
          issuedby: fliter[0].IssuedBy,
          situation: fliter[0].Situation,
          forbid: fliter[0].Forbid,
          doclist: fliter[0].DocList,
          processingtime: fliter[0].ProcessingTime,
          reward: fliter[0].Reward,
          rewardtime: fliter[0].RewardTime,
          provider: fliter[0].Provider,
          providerprice: fliter[0].ProviderPrice,
          providercountprice: fliter[0].ProviderCountPrice,
          price1: fliter[0].Price1,
          price1count: fliter[0].Price1Count,
          price2: fliter[0].Price2,
          price2count: fliter[0].Price2Count,
          price3: fliter[0].Price3,
          price3count: fliter[0].Price3Count,
          price4: fliter[0].Price4,
          price4count: fliter[0].Price4Count,
          score: fliter[0].Score,
          updatedate: fliter[0].UpdateDate,
          attachmentimage: fliter[0].AttachmentImage,
          attachmentfile: fliter[0].AttachmentFile,
        })
        if (fliter[0].Status == "在售") {
          this.setData({
            onsalechecked: true
          })
        } else {
          this.setData({
            onsalechecked: false
          })
        }
        for (let i = 0; i < fliter[0].AttachmentImage.length; i++) {
          wx.getImageInfo({
            //把图片地址转换为本地地址
            src: fliter[0].AttachmentImage[i],
            success: (res) => {
              this.setData({
                attachmentview: this.data.attachmentview.concat(res.path)
              })
              console.log("attachmentview", this.data.attachmentview)
            }
          })
        }

      },

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