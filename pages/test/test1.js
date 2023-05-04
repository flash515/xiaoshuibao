// pages/index5/index5.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    viList:[
      {
        vio:'https://assets.mixkit.co/videos/preview/mixkit-movement-in-a-large-avenue-at-night-in-timelapse-44688-large.mp4',
        avatar:'https://profile-avatar.csdnimg.cn/6ef2193c2e9649c88356336c626e5777_m0_64944135.jpg',
        name:'xiaoshen'
      },
      {
        vio:'https://assets.mixkit.co/videos/preview/mixkit-movement-in-a-large-avenue-at-night-in-timelapse-44688-large.mp4',
        avatar:'	https://profile.csdnimg.cn/7/A/9/1_2201_75886543',
        name:'kami'
      }
    ]
  },
 
  onLoad(options) {
        // 查询本人提交的InfoShare
        wx.cloud.callFunction({
          name: "NormalQuery",
          data: {
            collectionName: "INFOSHARE",
            command: "and",
            where: [{
              InfoStatus: "checked",
            }]
          },
          success: res => {
            this.setData({
              infoshares: res.result.data,
            })
            console.log("本人全部资讯", this.data.infoshares)
          }
        })
    // 调用播放视频方法
    this.startUp()
  },
 
  // 进页面时播放视频
  startUp(){
    // 获取video节点
    let createVideoContext = wx.createVideoContext('video0')
    // 播放视频
    createVideoContext.play()
  },
 
  // 切换视频的时候播放视频
  // 注：此方法视频如果过大可能会叠音，所以视频需要压缩，或者可以尝试循环节点关闭视频
  nextVideo(e){
    // 播放当前页面视频
    let index = 'video' + e.detail.current
    this.playVio(index)
    // 暂停前一个页面视频
    if(e.detail.current-1 >= 0){
      let index1 = 'video' + (e.detail.current-1)
      this.pauseVio(index1)
    }
    // 暂停后一个页面视频
    if(e.detail.current+1 < this.data.viList.length){
      let index2 = 'video' + (e.detail.current+1)
      this.pauseVio(index2)
    }
  },
 
  // 播放视频
  playVio(index){
    // 获取video节点
    let createVideoContext = wx.createVideoContext(index)
    // 播放视频
    createVideoContext.play()
  },
 
  // 暂停视频
  pauseVio(index){
    // 获取video节点
    let createVideoContext = wx.createVideoContext(index)
    // 暂停视频
    createVideoContext.pause()
  },
  // 分享朋友圈
  onShareTimeline: function () {
    return {
      title: this.data.sharetitle,
      query: '/pages/promote/infoshare?userid=' + app.globalData.Guserid,
      imageUrl: '', //封面
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.sharetitle,
      path: '/pages/promote/infoshare?userid=' + app.globalData.Guserid + '&infoid=' + this.data.infoid,
      imageUrl: '', //封面，留空自动抓取500*400生成图片
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
  }

})