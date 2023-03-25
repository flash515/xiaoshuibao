// pages/mine/providerapply.js
const app = getApp()
const util = require('../../utils/utils')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyname: "",
    companyid: "",
    businessscope: "",
    companyscale: "",
    contractchecked:false,
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
  },

  // 预览文件
  previewFile(fileLink) {

    if (!fileLink) {
      return false
    }
    util.showLoading()

    // 单次下载允许的最大文件为 200MB
    wx.downloadFile({
      url: "https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/setting/%E6%9C%8D%E5%8A%A1%E5%95%86%E6%9C%8D%E5%8A%A1%E5%8D%8F%E8%AE%AE20230315.pdf?sign=db764e5993fec167cbb57635ba08b104&t=1678967468", // 地址已打码，自己换个其他的地址("https://www.xxxxx.com/file/测试通知.pdf")
      success: function (res) {
        console.log(res, "wx.downloadFile success res")
        if (res.statusCode != 200) {
          util.hideLoadingWithErrorTips()
          return false
        }
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          showMenu: true,
          success: function (res) {
            console.log('打开成功');
            util.hideLoading()
          }
        })
      },
      fail: function (err) {
        console.log(err, "wx.downloadFile fail err");
        util.hideLoadingWithErrorTips()
      }
    })

  },
  bvCompanyName(e) {
    this.setData({
      companyname: e.detail.value
    })
  },
  bvCompanyId(e) {
    this.setData({
      companyid: e.detail.value
    })
  },
  bvBusinessScope(e) {
    this.setData({
      businessscope: e.detail.value
    })
  },
  bvCompanyScale(e) {
    this.setData({
      companyscale: e.detail.value
    })
  },
  bvContractCheck(e) {
    console.log(e.detail)
    this.setData({
      contractchecked: e.detail.checked
    })
  },
  bvApplyProvider(e) {
if(this.applysubmit==true|| this.data.applyproviderdate!=''){
  wx.showToast({
    title: '请勿重复提交',
    icon: 'error',
    duration: 2000
  })
}else{
    if (this.data.companyname != "" && this.data.companyid != "" && this.data.businessscope != "" && this.data.companyscale != "") {
      console.log('已完善信息')
      if (this.data.contractchecked == true) {
        const db = wx.cloud.database()
        db.collection('USER').where({
          UserId: app.globalData.Guserid
        }).update({
          data: {
            ["UserInfo.CompanyName"]: this.data.companyname,
            ["UserInfo.CompanyId"]: this.data.companyid,
            ["UserInfo.CompanyScale"]: this.data.companyscale,
            ["UserInfo.BusinessScope"]: this.data.businessscope,
            ["UserInfo.ApplyProviderDate"]: new Date().toLocaleString('chinese', {
              hour12: false
            })
          },
          success(res) {
            wx.showToast({
              title: '申请信息已发送',
              icon: 'success',
              duration: 2000 //持续的时间
            })
            this.applysubmit=true
            //给管理员发送短信
            var tempmobile = [18954744612]
            // 调用云函数发短信给推荐人和管理员
            // wx.cloud.callFunction({
            //   name: 'sendsms',
            //   data: {
            //     templateId: "1569087",
            //     nocode: true,
            //     mobile: tempmobile
            //   },
            //   success: res => {
            //     console.log("短信发送结果", res)
            //   },
            //   fail: res => {
            //     console.log(res)
            //   },
            // })
          },
          fail(res) {
            wx.showToast({
              title: '更新信息失败',
              icon: 'error',
              duration: 2000 //持续的时间
            })
          }
        })

      } else {
        wx.showToast({
          title: '请确认协议条款',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      }

    } else {
      wx.showToast({
        title: '请完善信息',
        icon: 'error',
        duration: 2000
      })

    }
  }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      image: app.globalData.Gimagearray,
      companyname: app.globalData.Guserdata.UserInfo.CompanyName,
      companyid: app.globalData.Guserdata.UserInfo.CompanyId,
      businessscope: app.globalData.Guserdata.UserInfo.BusinessScope,
      companyscale: app.globalData.Guserdata.UserInfo.CompanyScale,
      applyproviderdate:app.globalData.Guserdata.UserInfo.ApplyProviderDate,
    })
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