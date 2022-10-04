// pages/manage/sortedit.js
const app = getApp()
const { startToTrack, startByClick, startByBack } = require("../../utils/track");;
const SortArray = [{
    "Category1Code": "01",
    "Category1Name": "商务服务",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "地址服务",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳地址"
          },
          {
            "Category3Code": "02",
            "Category3Name": "广州地址"
          },
          {
            "Category3Code": "03",
            "Category3Name": "东莞地址"
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "工商代办",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "工商注册"
          },
          {
            "Category3Code": "02",
            "Category3Name": "工商变更"
          },
          {
            "Category3Code": "03",
            "Category3Name": "工商注销"
          },
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "银行代办",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "银行开户"
          },
          {
            "Category3Code": "02",
            "Category3Name": "调整额度"
          },
          {
            "Category3Code": "03",
            "Category3Name": "银行销户"
          },
        ]
      },
      {
        "Category2Code": "04",
        "Category2Name": "财税服务",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "记账报税"
          },
          {
            "Category3Code": "02",
            "Category3Name": "税种核定"
          },
          {
            "Category3Code": "03",
            "Category3Name": "领票购票"
          },
          {
            "Category3Code": "04",
            "Category3Name": "开票代办"
          },
        ]
      },
      {
        "Category2Code": "05",
        "Category2Name": "企业托管",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "南昌托管"
          },
          {
            "Category3Code": "02",
            "Category3Name": "西安托管"
          },
          {
            "Category3Code": "03",
            "Category3Name": "明光托管"
          },
        ]
      },
      {
        "Category2Code": "06",
        "Category2Name": "资质代办",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "食品经营许可证"
          },
          {
            "Category3Code": "02",
            "Category3Name": "道路运输许可证"
          },
        ]
      }
    ]
  },
  {
    "Category1Code": "02",
    "Category1Name": "教培信息",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "学历教育",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "大专学历"
          },
          {
            "Category3Code": "02",
            "Category3Name": "本科学历"
          },
          {
            "Category3Code": "03",
            "Category3Name": "硕士学历"
          },
          {
            "Category3Code": "04",
            "Category3Name": "博士学历"
          },
          {
            "Category3Code": "05",
            "Category3Name": "出国留学"
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "职业教育",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "厨师"
          },
          {
            "Category3Code": "02",
            "Category3Name": "家政服务师"
          },
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "技能培训",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "电商"
          },
          {
            "Category3Code": "02",
            "Category3Name": "财会"
          },
        ]
      }

    ]
  },

  {
    "Category1Code": "03",
    "Category1Name": "就业招聘",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "国内就业",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "全职"
          },
          {
            "Category3Code": "02",
            "Category3Name": "兼职"
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "国际就业",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "美国"
          },
          {
            "Category3Code": "02",
            "Category3Name": "日本"
          },
          {
            "Category3Code": "03",
            "Category3Name": "澳大利亚"
          },
          {
            "Category3Code": "04",
            "Category3Name": "英国"
          },
          {
            "Category3Code": "05",
            "Category3Name": "新加坡"
          },
          {
            "Category3Code": "07",
            "Category3Name": "香港地区"
          },
          {
            "Category3Code": "08",
            "Category3Name": "澳门地区"
          },
        ]
      }
    ]
  },
  {
    "Category1Code": "04",
    "Category1Name": "其他信息",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "其他信息",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "其他信息"
          },
        ]
      },
    ]
  },
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 产品分类参数
    inputShow: false,
    boxShow: false,
    sortarray: SortArray,
    category1: SortArray[0].Category1Name,
    pIndex: 0,
    category2: SortArray[0].Category2Array[0].Category2Name,
    cIndex: 0,
    category3: SortArray[0].Category2Array[0].Category3Array[0].Category3Name,
    aIndex: 0,
    code1: "",
    code2: "",
    code3: "",
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
      productid: [this.data.code1] + [this.data.code2] + [this.data.code3]
    })

  },
  SortUpdate() {
    wx.cloud.callFunction({
      name: 'MeetingRoomSetting',
      data: {
        key1: "SortArray",
        value1: this.data.sortarray,
      },
      success: res => {
        console.log("执行了")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // wx.getStorage({
    //   key: 'LSetting',
    //   success: res => {
    //       this.setData({
    //         sortarray: res.data.SortArray,
    //       })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})