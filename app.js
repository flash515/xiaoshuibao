//app.js
App({
  onLaunch:async function() {
    // 测试async，await可用
    // (async () => {
    //   const p = await new Promise(resolve => {
    //     setTimeout(() => resolve("hello async/await"), 1000);
    //   });
    //   console.log(p);
    // })();

   wx.cloud.init({
      env: 'xsbmain-9gvsp7vo651fd1a9',
      traceUser: false,
    })
    // 初始化全局参数
    this.globalData = {}

    // 清除本地存储数据,调试发布后可去除

    wx.clearStorage({
      success: (res) => {
        console.log("清除本地存储数据成功")
      },
    })

    wx.getSystemInfo({ // 获取设备宽高
      success: res => {
        this.globalData.Gsysteminfo = res
        console.log("可用屏幕高", this.globalData.Gsysteminfo.windowHeight)
        console.log("可用屏幕宽", this.globalData.Gsysteminfo.windowWidth)
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
    //全局变量要考虑新用户初始情况及老用户赋值情况，尽量避免过于概括或过于琐碎
    // 接收到的参数数组,包含推荐人userid,页面路径page，来源编号source等
    Gsysteminfo: [], //系统参数

    GWidth: "", // 屏幕可用宽度
    GHeight: "", // 屏幕可用高度
    Gsetting: [], //设置信息

    Gproduct: [], // 在售商品
    Gproductlist: [], // 数据库中全部商品

    Guserid: "", // 用户本人小程序id 
    Guserdata: [], //用户个人全部数据,

    Gdirect1yearvaliduser: "", //一年内有效推荐用户数

    Gsearch: [],
    Gtrack: [], //浏览记录
    // 直接推荐人
    Ginviter: [], //推荐人信息,待删除
    Ginviterid: "", //推荐人id
    Ginviterphone: "", //推荐人手机，发送认证积分短信时使用
    Ginviterpromoterlevel: "", //推荐人推广级别,待删除
    Ginviterbalance: "", //推荐人积分,待删除
    // 间接推荐人
    Gindirectinviter: [], //间接推荐人信息,待删除
    Gindirectinviterid: "", //间接推荐人id,
    Gindirectinviterpromoterlevel: "", //间接推荐人推广级别,待删除
    Gindirectinviterbalance: "", //间接推荐人积分,待删除

    Gimagearray: [], //轮播图

    //个人设置参数
    Gpriceshow: '',
    Gdirectvalueshow: '',
    Gindirectvalueshow: '',
    Gdirectusershow: '',
    Gindirectusershow: '',
    Gvaluedetailshow: '',
    Guserdetailshow: '',
  }
})