
const app = getApp()

Page({
  data: {
    inviterid:"",
    starttime:"",
    avatarUrl: './user-unlogin.png',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    // chatRoomEnvId: 'release-f8415a',
    chatRoomCollection: 'MeetingRoom3',
    chatRoomGroupId: 'demo',
    chatRoomGroupName: '小税宝快捷会议室三',

    // functions for used in chatroom components
    onGetUserInfo: null,
    getOpenID: null,
  },

  onLoad: function(options) {
      this.data.inviterid = options.userid;
      app.globalData.Ginviterid = options.userid;
      this.data.starttime=options.starttime;
      console.log("方法一如果参数以userid=格式存在，则显示接收到的参数", this.data.inviterid);
      console.log(Date.parse(new Date()) - this.data.starttime);
      // 接收参数方法一结束

if(Date.parse(new Date()) - this.data.starttime<"3600000"){
  const db = wx.cloud.database()
  db.collection('USER').where({
    _openid: this.data.inviterid
  }).get({
    success: res => {
      wx.setStorageSync('LInviter', res.data[0]);
      this.setData({
        invitercompanyname: res.data[0].CompanyName,
        inviterusername: res.data[0].UserName,
        indirectinviterid: res.data[0].InviterOpenId
      })
      app.globalData.Gindirectinviterid = res.data[0].InviterOpenId;
      app.globalData.Ginviterpromoterlevel = res.data[0].PromoterLevel;
    }
  })

    this.setData({
      // onGetUserInfo: this.onGetUserInfo,
      getOpenID: this.getOpenID,
    })
    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          })
        }
      },
    })
}else{
  wx.redirectTo({
    url: '../meetingroom/meetingroom',
  })
}
  },
  getOpenID: async function() {
    if (this.openid) {
      return this.openid
    }

    const { result } = await wx.cloud.callFunction({
      name: 'login',
    })

    return result.openid
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },
  onShareAppMessage() {
    return {
      title: app.globalData.GnickName + '邀请您进入小税宝快捷会议室三，此邀请60分钟内有效',
      path: '/pages/tools/meetingroom/meetingroom3?userid=' + app.globalData.Gopenid+'&starttime='+this.data.starttime,
      imageUrl: 'cloud://xsbmain-9gvsp7vo651fd1a9.7873-xsbmain-9gvsp7vo651fd1a9-1304477809/omLS75Xib_obyxkVAahnBffPytcA/index.png', //封面
        }
  },
})
