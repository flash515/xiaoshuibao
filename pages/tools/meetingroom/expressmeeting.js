const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
    inviterid: "",
    starttime: "",
    avatarUrl: defaultAvatarUrl,
    nickName:"",
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    // chatRoomEnvId: 'release-f8415a',
    chatRoomCollection: 'ExpressMeeting',
    chatRoomGroupId: 'demo',
    chatRoomGroupName: '快捷会议室',

    // functions for used in chatroom components
    onGetUserInfo: null,
    getOpenID: null,

  },
formsumit(e){
  console.log(e)
  if(e.detail.value.nickname==""){
    wx.showToast({
      title: '请点击获取昵称',
      icon: 'error',
      duration: 2000 //持续的时间
    })

  }else{
this.setData({
nickName:e.detail.value.nickname
})
}
},
onChooseAvatar(e) {
  const { avatarUrl } = e.detail 
  this.setData({
    avatarUrl,
  })
},
  onLoad: function (options) {
    this.data.inviterid = options.userid;
    app.globalData.Ginviterid = options.userid;
    this.data.starttime = options.starttime;
    console.log("方法一如果参数以userid=格式存在，则显示接收到的参数", this.data.inviterid);
    console.log(Date.parse(new Date()) - this.data.starttime);
    // 接收参数方法一结束

    if (Date.parse(new Date()) - this.data.starttime < "3600000") {
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
      if (app.globalData.Gsysteminfo.safeArea) {
        const {
          top,
          bottom
        } = app.globalData.Gsysteminfo.safeArea
        this.setData({
          containerStyle: `padding-top: ${(/ios/i.test(app.globalData.Gsysteminfo.system) ? 10 : 20) + top}px; padding-bottom: ${20 + app.globalData.Gsysteminfo.windowHeight - bottom}px`,
        })
      }
    } else {
      wx.redirectTo({
        url: '../meetingroom/meetingroom',
      })
    }
  },
  getOpenID: async function () {
    if (this.openid) {
      return this.openid
    }

    const {
      result
    } = await wx.cloud.callFunction({
      name: 'login',
    })

    return result.openid
  },

  onGetUserInfo: function (e) {
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
      title: app.globalData.Guserinfo.nickName + '邀请您加入快捷会议室，此邀请60分钟内有效',
      path: '/pages/tools/meetingroom/expressmeeting?type=express&userid=' + app.globalData.Gopenid + '&starttime=' + this.data.starttime,
      imageUrl: '', //封面
    }
  },
})