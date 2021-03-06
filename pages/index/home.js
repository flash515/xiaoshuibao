// pages/index/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    nickName: "",
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

  // 转发小程序功能
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.Gcompanyname + app.globalData.Gusername + '邀请您体验：',
      path: '/pages/index/index?userid=' + app.globalData.Gopenid,
      imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/omLS75Xib_obyxkVAahnBffPytcA/sharepic.png?sign=9064611f2619d44b847ebdb2e02dc988&t=1621407312', //封面
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
  onShareTimeline: function(){
    return {
    title: '真的有宝哦，快来体验税筹资源小程序！',
    query: '/pages/index/index?userid=' + app.globalData.Gopenid,
    imageUrl: 'https://7873-xsbmain-9gvsp7vo651fd1a9-1304477809.tcb.qcloud.la/omLS75Xib_obyxkVAahnBffPytcA/sharepic.png?sign=9064611f2619d44b847ebdb2e02dc988&t=1621407312', //封面
    }
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
  /**
   * 生命周期函数--监听页面加载
  //  */
  onLoad: function (options) {

    const db = wx.cloud.database()
    db.collection('notice').get({
      success: res => {
        let tempnoticearray = []
        for (let i = 0; i < res.data.length; i++) {
          tempnoticearray.push(res.data[i].Content)
        }
        //一定要用setData赋值才会在前端出现
        this.setData({
          noticearray: tempnoticearray
        })
        console.log("noticearray", this.data.noticearray)
      }
    })
    wx.cloud.callFunction({
      name: 'ShareUserQuery',
      data: {
        userid: app.globalData.Gopenid,
      },
      success: res => {
        wx.setStorageSync('LDirectUser', res.result.data);
        // 查询结果赋值给数组参数
        console.log("云函数查询直接推广用户", res.result.data)
        this.IndirectUserQuery(res.data)
      }
    })
  },
  IndirectUserQuery: function (options) {
    // 从本地存储中读取
    wx.getStorage({
      key: 'LDirectUser',
      success: res => {
        console.log("云函数查询间接输入", res.data)
        // 云函数查询全部直接分享人员信息
        wx.cloud.callFunction({
          name: 'IndirectUserQuery',
          data: {
            userarray: res.data,
            // userarray: options.data,
          },
          success: res => {
            console.log("云函数查询间接输出", res.result)
            // 所有直接推荐人的信息存入本地，会受100条限制，待改进
            wx.setStorageSync('LIndirectUser', res.result)
          }
        })
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
    this.setData({
      avatarUrl: app.globalData.GavatarUrl,
      nickName: app.globalData.GnickName,
      image: app.globalData.Gimagearray
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