// pages/index/home.js
const app = getApp()
const {
  startToTrack,
  startByClick,
  startByBack,
} = require("../../utils/track");
var {
  _directuser,
  _indirectuser
} = require("../../utils/utils")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    usertype: "",
    avatarUrl: "",
    nickName: "",
    userphone: "",
    promoterlevel: "",
    noticearray: [],
    // 轮播头图
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
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    const db = wx.cloud.database()
    db.collection('USER').where({
      UserId: app.globalData.Guserid,
    }).update({
      data: {
        ['UserInfo.Region']: this.data.region
      }
    })
  },
  // 转发小程序功能
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.Guserdata.UserInfo.nickName + '邀请您体验：',
      path: '/pages/index/index?userid=' + app.globalData.Guserid,
      imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/sharepic.png?sign=550a147f349dddb2a06196826020450d&t=1659681079', //封面
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
  // 分享朋友圈
  onShareTimeline: function () {
    return {
      title: '真的有宝哦，快来体验税筹资源小程序！',
      query: '/pages/index/index?userid=' + app.globalData.Guserid,
      imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/image/sharepic.png?sign=550a147f349dddb2a06196826020450d&t=1659681079', //封面
    }
  },

  /**
   * 生命周期函数--监听页面加载
  //  */
  onLoad: async function (options) {
    this.setData({
      region: app.globalData.Guserdata.UserInfo.Region
    })
    // 使用双等号是比较，否则单等号变成赋值
    if (app.globalData.Guserdata.TradeInfo.PromoterLevel == "member") {
      this.setData({
        promoterlevel : "会员"
      })
    } else if (app.globalData.Guserdata.TradeInfo.PromoterLevel == "silver") {
      this.setData({
        promoterlevel : "白银会员"
      })
    } else if (app.globalData.Guserdata.TradeInfo.PromoterLevel == "gold") {
      this.setData({
        promoterlevel : "黄金会员"
      })
    } else if (app.globalData.Guserdata.TradeInfo.PromoterLevel == "platinum") {
      this.setData({
        promoterlevel : "铂金会员"
      })
    }else{
      this.setData({
        promoterlevel : "普客"
      })
    }
    if (app.globalData.Guserdata.UserInfo.UserType == "client") {
      this.setData({
        usertype : "客户"
      })
    } else if (app.globalData.Guserdata.UserInfo.UserType == "provider") {
      this.setData({
        usertype : "供应伙伴"
      })
    } else if (app.globalData.Guserdata.UserInfo.UserType == "admin") {
      this.setData({
        usertype : "管理员"
      })
    }

    const db = wx.cloud.database()
    db.collection('notice').where({
      Status: "onshow"
    }).get({
      success: res => {
        let tempnoticearray = []
        for (let i = 0; i < res.data.length; i++) {
          tempnoticearray.push(res.data[i].Content)
        }
        //一定要用setData赋值才会在前端出现
        this.setData({
          noticearray: tempnoticearray,
        })
        console.log("noticearray", this.data.noticearray)
      }
    })
    await _directuser(app.globalData.Guserid)
    await _indirectuser(app.globalData.Guserid)
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
      image: app.globalData.Gimagearray,
      userphone: app.globalData.Guserdata.UserInfo.UserPhone,

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

})