//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'xsbmain-9gvsp7vo651fd1a9',
        traceUser: true,
      })
    }
    // 初始化全局参数
    this.globalData = {}
    // 清除本地存储数据,调试发布后可去除

    wx.clearStorage({
      success: (res) => {
        console.log("清除本地存储数据成功")
      },
    })

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    wx.getSystemInfo({ // 获取设备宽高 canvas设置  由于项目需求背景图不是整屏  我把高减少一部分
      success: res => {
        this.globalData.Gsysteminfo=res
        console.log("可用屏幕高",this.globalData.Gsysteminfo.windowHeight)
        console.log("可用屏幕宽",this.globalData.Gsysteminfo.windowWidth)
      }

    })
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        console.log('onCheckForUpdate====', res)
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          console.log('res.hasUpdate====')
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '小税宝新版本已经准备好，请重启小程序',
              success: function (res) {
                console.log('success====', res)
                // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新的版本',
              content: '小税宝新版本已经上线，请删除当前小程序，重新搜索并打开'
            })
          })
        }
      })
    }
  },
  globalData: {
    // 接收到的参数数组,包含推荐人userid,页面路径page，来源编号source等
    Gparams:[],
    Gsysteminfo:[],
    // 屏幕可用宽高
    GWidth: "",
    GHeight: "",
    // 产品
    Gsortarray: [],
    // 在售产品
    Gproduct:[],
    // 数据库中全部产品
    Gproductlist: [],
    // 用户小程序id 
    Gopenid: "",
    //用户本人信息
    Guserinfo:[],
    Gdirect1yearvaliduser: "",
    Gpointsmagnification: "",
    Gsearch:[],
    Gtrack: [],
    // 直接推荐人
    Ginviter:[],
    Ginviterid: "",
    Ginviterpromoterlevel: "",
    Ginviterbalance: "",
    // 间接推荐人
    Gindirectinviter:[],
    Gindirectinviterid: "",
    Gindirectinviterpromoterlevel: "",
    Gindirectinviterbalance: "",

    //轮播图
    Gimagearray: [],
    //设置

    Gpriceshow: '',
    Gdirectvalueshow: '',
    Gindirectvalueshow: '',
    Gdirectusershow: '',
    Gindirectusershow: '',
    Gvaluedetailshow: '',
    Guserdetailshow: '',
  }
})