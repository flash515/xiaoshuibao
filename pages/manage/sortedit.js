// pages/manage/sortedit.js
const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");;
const SortArray1 = [{
    "Category1Code": "01",
    "Category1Name": "地址服务",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "地址挂靠",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳挂靠",
          },
          {
            "Category3Code": "02",
            "Category3Name": "广州挂靠",
          },
          {
            "Category3Code": "03",
            "Category3Name": "东莞挂靠",
          }
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "场地出租",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳出租",
          },
          {
            "Category3Code": "02",
            "Category3Name": "广州出租",
          },
          {
            "Category3Code": "03",
            "Category3Name": "东莞出租",
          }
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "共享办公",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳共享",
          },
          {
            "Category3Code": "02",
            "Category3Name": "广州共享",
          },
          {
            "Category3Code": "03",
            "Category3Name": "东莞共享",
          }
        ]
      },
    ]
  },
  {
    "Category1Code": "02",
    "Category1Name": "工商代办",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "工商注册",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳注册",
          },
          {
            "Category3Code": "02",
            "Category3Name": "南昌注册",
          },
          {
            "Category3Code": "03",
            "Category3Name": "西安注册",
          }
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "工商变更",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳变更",
          },
          {
            "Category3Code": "02",
            "Category3Name": "南昌变更",
          },
          {
            "Category3Code": "03",
            "Category3Name": "西安变更",
          }
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "工商注销",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳注销",
          },
          {
            "Category3Code": "02",
            "Category3Name": "南昌注销",
          },
          {
            "Category3Code": "03",
            "Category3Name": "西安注销",
          }
        ]
      }
    ]
  },
  {
    "Category1Code": "03",
    "Category1Name": "财税服务",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "记账报税",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳记账",
          },
          {
            "Category3Code": "02",
            "Category3Name": "南昌记账",
          },
          {
            "Category3Code": "03",
            "Category3Name": "西安记账",
          }
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "税种核定",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳核税",
          },
          {
            "Category3Code": "02",
            "Category3Name": "南昌核税",
          },
          {
            "Category3Code": "03",
            "Category3Name": "西安核税",
          }
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "领票购票",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳领票",
          },
          {
            "Category3Code": "02",
            "Category3Name": "南昌领票",
          },
          {
            "Category3Code": "03",
            "Category3Name": "西安领票",
          }
        ]
      },
      {
        "Category2Code": "04",
        "Category2Name": "开票代办",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳开票",
          },
          {
            "Category3Code": "02",
            "Category3Name": "南昌开票",
          },
          {
            "Category3Code": "03",
            "Category3Name": "西安开票",
          }
        ]
      },
      {
        "Category2Code": "05",
        "Category2Name": "自然人代办",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳代办",
          },
          {
            "Category3Code": "02",
            "Category3Name": "湖南代办",
          },
          {
            "Category3Code": "03",
            "Category3Name": "湖北代办",
          },
          {
            "Category3Code": "04",
            "Category3Name": "河南代办",
          },
          {
            "Category3Code": "05",
            "Category3Name": "山东代办",
          },
        ]
      },
    ]
  },
  {
    "Category1Code": "04",
    "Category1Name": "企业托管",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "个体户托管",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "南昌托管",
          },
          {
            "Category3Code": "02",
            "Category3Name": "西安托管",
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "公司托管",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "明光托管",
          },
          {
            "Category3Code": "02",
            "Category3Name": "西安托管",
          },
        ]
      },
    ]
  },
  {
    "Category1Code": "05",
    "Category1Name": "资质代办",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "食品经营许可证",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳许可证",
          },
          {
            "Category3Code": "02",
            "Category3Name": "广州许可证",
          },
          {
            "Category3Code": "03",
            "Category3Name": "东莞许可证",
          }
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "道路运输许可证",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳许可证",
          },
          {
            "Category3Code": "02",
            "Category3Name": "上海许可证",
          },
        ]
      },
    ]
  },
];
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
}, ];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 产品分类参数
    inputShow: false,
    boxShow: false,
    sortarray: SortArray1,
    category1: SortArray[0].Category1Name,
    pIndex: 0,
    category2: SortArray[0].Category2Array[0].Category2Name,
    cIndex: 0,
    category3: SortArray[0].Category2Array[0].Category3Array[0].Category3Name,
    aIndex: 0,
    code1: "",
    code2: "",
    code3: "",
    category1id: "",
    category1name: ""
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
  bvCategoryCode(e) {
    const i = e.target.dataset.index
    console.log(e.target.dataset.index)
    this.setData({
      // sortarray[i].Category1Code: e.detail.value
    })
  },
  bvCategory1Id(e) {
    this.setData({
      category1id: e.detail.value
    })
  },
  bvCategory1Id(e) {
    this.setData({
      category1id: e.detail.value
    })
  },
  bvCategory1Name(e) {
    this.setData({
      category1name: e.detail.value
    })
  },
  bvCategory1Add() {
    var temparray = this.data.sortarray.concat({
      "Category1Code": this.data.category1id,
      "Category1Name": this.data.category1name,
      "Category2Array": []
    })
    console.log(temparray)
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
    console.log(this.data.sortarray)
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