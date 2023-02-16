// pages/manage/sortedit.js
const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack
} = require("../../utils/track");;
const SortArray = [{
    "Category1Code": "01",
    "Category1Name": "地址服务",
    "Category2Array": [{
        "Category2Code": "01",
        "Category2Name": "地址挂靠",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳挂靠",
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "商秘地址",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳商秘",
          },
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
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "工商变更",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳变更",
          },
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "工商注销",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "深圳注销",
          },
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
            "Category3Name": "深圳记账报税",
          },
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "税票代办",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "自然人代办",
          },
          {
            "Category3Code": "02",
            "Category3Name": "企业代办",
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
          {
          "Category3Code": "03",
          "Category3Name": "玉溪托管",
        },

        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "公司托管",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "上海托管",
          },
          {
            "Category3Code": "02",
            "Category3Name": "明光托管",
          },

          {
            "Category3Code": "03",
            "Category3Name": "宁波托管",
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
        ]
      },
      {
        "Category2Code": "02",
        "Category2Name": "道路运输许可证",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "上海许可证",
          },
          {
            "Category3Code": "02",
            "Category3Name": "明光许可证",
          },
          {
            "Category3Code": "02",
            "Category3Name": "宁波许可证",
          },
        ]
      },
      {
        "Category2Code": "03",
        "Category2Name": "医疗器械经营许可证",
        "Category3Array": [{
            "Category3Code": "01",
            "Category3Name": "上海许可证",
          },
          {
            "Category3Code": "02",
            "Category3Name": "明光许可证",
          },
          {
            "Category3Code": "02",
            "Category3Name": "宁波许可证",
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
    // 商品分类参数
    sortarray: [],

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
    //SortArray没有在pages data当中，所以不需要用this.data,
    this.setData({
      sortarray:SortArray
    })
    console.log(this.data.sortarray)

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