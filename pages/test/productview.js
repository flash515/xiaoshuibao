const app = getApp()

import {
  pinyin
} from 'pinyin-pro';
Page({
  data: {
    usertype: "admin",
    x: 0,
    // 传值参数
    recordid: "",
    pageParam: "",
    // 产品参数
    productarray: [], //通过查询功能得到的产品数组
    productdetail: [],
    array: [],
    // 产品分类参数
    inputShow: false,
    boxShow: false,
    sortarray: [],
    category1: "",
    pIndex: 0,
    category2: "",
    cIndex: 0,
    category3: "",
    aIndex: 0,
    code1: "",
    code2: "",
    code3: "",
    code4: "00",
    namecode: "",
    serialcode: "000",
    // 表单参数
    showvalue1: true,
    showvalue2: true,
    showvalue3: true,
    showvalue4: true,
    showvalue5: true,
    showvalue6: true,
    showvalue7: true,
    showvalue8: true,
    showvalue9: true,
    showvalue10: true,
    showvalue11: true,
    showvalue12: true,
    showvalue13: true,
    showvalue14: true,
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
    showvalue28: true,
    showvalue29: true,
    showvalue30: false,
    showvalue31: false,
    showvalue32: true,
    showvalue33: true,
    showvalue34: true,
    adddate: "",
    productid: "",
    producttype: "",
    productname: "",
    outline: "",
    startdate: "",
    enddate: "",
    description: "",
    max:3,
    servicearea:[],
    handleplace: ["广东省", "深圳市"],
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
    recordcontral: false,
    items: [
      { value: '全国', checked: true, disabled: false },
      { value: '广东省', checked: false, disabled: false },
      { value: '北京市', checked: false, disabled: false },
      { value: '天津市', checked: false, disabled: false },
      { value: '上海市', checked: false, disabled: false },
      { value: '重庆市', checked: false, disabled: false },
      { value: '河北省', checked: false, disabled: false },
      { value: '山西省', checked: false, disabled: false },
      { value: '辽宁省', checked: false, disabled: false },
      { value: '吉林省', checked: false, disabled: false },
      { value: '黑龙江省', checked: false, disabled: false },
      { value: '江苏省', checked: false, disabled: false },
      { value: '浙江省', checked: false, disabled: false },
      { value: '安徽省', checked: false, disabled: false },
      { value: '福建省', checked: false, disabled: false },
      { value: '江西省', checked: false, disabled: false },
      { value: '山东省', checked: false, disabled: false },
      { value: '河南省', checked: false, disabled: false },
      { value: '湖北省', checked: false, disabled: false },
      { value: '湖南省', checked: false, disabled: false },
      { value: '海南省', checked: false, disabled: false },
      { value: '四川省', checked: false, disabled: false },
      { value: '贵州省', checked: false, disabled: false },
      { value: '云南省', checked: false, disabled: false },
      { value: '陕西省', checked: false, disabled: false },
      { value: '甘肃省', checked: false, disabled: false },
      { value: '青海省', checked: false, disabled: false },
      { value: '内蒙古自治区', checked: false, disabled: false },
      { value: '西藏自治区', checked: false, disabled: false },
      { value: '宁夏回族自治区', checked: false, disabled: false },
      { value: '新疆维吾尔自治区', checked: false, disabled: false },
      { value: '广西壮族自治区', checked: false, disabled: false },
      { value: '香港特别行政区', checked: false, disabled: false },
      { value: '澳门特别行政区', checked: false, disabled: false },
      { value: '台湾省', checked: false, disabled: false },
    ]
  },

  // 展示弹框
  getbox: function () {
    this.setData({
      boxShow: true
    })
  },
  // 隐藏弹框
  hidebox: function () {
    this.setData({
      boxShow: false
    })
  },
  // 确认按钮
  confirm: function () {
    this.setData({
      boxShow: false,
      inputShow: true,
    })
  },
  changeCategory1: function (e) {
    const val = e.detail.value
    this.setData({
      pIndex: val,
      cIndex: 0,
      aIndex: 0,
      category1: this.data.sortarray[val].Category1Name,
      category2: this.data.sortarray[val].Category2Array[0].Category2Name,
      category3: this.data.sortarray[val].Category2Array[0].Category3Array[0].Category3Name,
      code1: this.data.sortarray[val].Category1Code,
      code2: this.data.sortarray[val].Category2Array[0].Category2Code,
      code3: this.data.sortarray[val].Category2Array[0].Category3Array[0].Category3Code,
    })
    this.productCode()
  },
  changeCategory2: function (e) {
    const val = e.detail.value
    this.setData({
      cIndex: val,
      aIndex: 0,
      category2: this.data.sortarray[this.data.pIndex].Category2Array[val].Category2Name,
      category3: this.data.sortarray[this.data.pIndex].Category2Array[val].Category3Array[0].Category3Name,
      code2: this.data.sortarray[this.data.pIndex].Category2Array[val].Category2Code,
      code3: this.data.sortarray[this.data.pIndex].Category2Array[val].Category3Array[0].Category3Code,
    })
    this.productCode()
  },
  changeCategory3: function (e) {
    const val = e.detail.value
    this.setData({
      aIndex: val,
      category3: this.data.sortarray[this.data.pIndex].Category2Array[this.data.cIndex].Category3Array[val].Category3Name,
      code3: this.data.sortarray[this.data.pIndex].Category2Array[this.data.cIndex].Category3Array[val].Category3Code,
    })
    this.productCode()
  },

  productCode() {
    this.setData({
      productcode: [this.data.namecode] + "-" + [this.data.code1] + [this.data.code2] + [this.data.code3] + [this.data.code4]
    })
    this.serialCode()
  },
  serialCode() {
    var temp = []
    for (var i = 0; i < this.data.productarray.length; i++) {
      if (this.data.productcode == this.data.productarray[i].ProductId.slice(0, -4)) {
        temp.push(this.data.productarray[i])
      }
    }
    console.log(temp)
    if (temp.length != 0) {
      this.setData({
        serialcode: ("0000" + [temp.length + 1]).substr(-3)
      })
    } else {
      this.setData({
        serialcode: "001"
      })
    }
    this.productId()
  },
  productId() {
    this.setData({
      productid: [this.data.namecode] + "-" + [this.data.code1] + [this.data.code2] + [this.data.code3] + [this.data.code4] + "-" + [this.data.serialcode]
    })
  },
  //查询本人创建且符合模糊条件的记录
  onSearch(e) {
    // 待修改，服务商只在自已产品中选择，管理员在全部产品中选择,页面加载时已查询，不需要重复查询
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('PRODUCT').where(_.and([{
        _openid: app.globalData.Gopenid
      },
      _.or([{
          HandlePlace: {
            $regex: '.*' + e.detail.value,
            $options: 'i'
          }
        },
        {
          ProductName: {
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
        console.log(this.data.productarray)
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
  ToastOn(){
    wx.showToast({
      title: '已开启展示开关',
      icon: 'none',
      duration: 2000 //持续的时间
    })
  },
  ToastOff(){
    wx.showToast({
      title: '已关闭展示开关',
      icon: 'none',
      duration: 2000 //持续的时间
    })
  },
  SVChange(e) {
console.log(e.currentTarget.dataset.id)
if (e.detail.value == true) {
this.ToastOn()
} else {
  this.ToastOff()
}
if(e.currentTarget.dataset.id==1){
  this.setData({
    showvalue1:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==2){
  this.setData({
    showvalue2:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==3){
  this.setData({
    showvalue3:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==4){
  this.setData({
    showvalue4:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==5){
  this.setData({
    showvalue5:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==6){
  this.setData({
    showvalue6:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==7){
  this.setData({
    showvalue7:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==8){
  this.setData({
    showvalue8:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==9){
  this.setData({
    showvalue9:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==10){
  this.setData({
    showvalue10:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==11){
  this.setData({
    showvalue11:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==12){
  this.setData({
    showvalue12:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==13){
  this.setData({
    showvalue13:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==14){
  this.setData({
    showvalue14:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==15){
  this.setData({
    showvalue15:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==16){
  this.setData({
    showvalue16:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==17){
  this.setData({
    showvalue17:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==18){
  this.setData({
    showvalue18:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==19){
  this.setData({
    showvalue19:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==20){
  this.setData({
    showvalue20:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==21){
  this.setData({
    showvalue21:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==22){
  this.setData({
    showvalue22:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==23){
  this.setData({
    showvalue23:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==24){
  this.setData({
    showvalue24:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==25){
  this.setData({
    showvalue25:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==26){
  this.setData({
    showvalue26:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==27){
  this.setData({
    showvalue27:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==28){
  this.setData({
    showvalue28:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==29){
  this.setData({
    showvalue29:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==30){
  this.setData({
    showvalue30:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==31){
  this.setData({
    showvalue31:e.detail.value
  })
}
else if(e.currentTarget.dataset.id==32){
  this.setData({
    showvalue32:e.detail.value
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
      productname: e.detail.value,
      namecode: pinyin(e.detail.value, {
        pattern: 'first',
        toneType: 'none'
      }).toUpperCase().replace(/\s+/g, '')
    })
    console.log(this.data.namecode)
    this.productCode()
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

  checkboxChange(e) {
    let { key } = e.currentTarget.dataset;
    this.setData({
      [key]: e.detail.value
    })
  },
  bvServiceArea(e){ //设置当前checkbox的值
    console.log('checkbox发生change事件，携带value值为：', e.detail)

    const items = this.data.items
    const values = e.detail.key
    for (let i = 0, lenI = items.length; i < lenI; ++i) {
      items[i].isChecked = false

      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (items[i].value === values[j]) {
          items[i].isChecked = true
          break
        }
      }
    }

    this.setData({
      items
    })
     
    },
  bindPlaceChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      handleplace: [e.detail.value[0], e.detail.value[1]]
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
      sortarray: app.globalData.Gsortarray,
      category1: app.globalData.Gsortarray[0].Category1Name,
      category2: app.globalData.Gsortarray[0].Category2Array[0].Category2Name,
      category3: app.globalData.Gsortarray[0].Category2Array[0].Category3Array[0].Category3Name,
    })

    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "PRODUCT",
        command: "or",
        where: [
          {
          Status:"在售"
        },
        {
          Status:"停售"
        }
      ]
      },
      success: res => {
        this.setData({
          productarray: res.result.data
        })
        console.log("产品数组", res.result.data)
        console.log("产品数组", this.data.productarray)
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