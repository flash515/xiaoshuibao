const app = getApp()
const { startToTrack, startByClick, startByBack } = require("../../utils/track");
var {
  _balancecheck
} = require("../../utils/initialize")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userphone:"",
    balance: 0,
    balanceupdatetime:"",
    personalhistory:[],
    inviterhistory:[],
    indirectinviterhistory:[],
    consumehistory:[],
    pointshistory: [],
    Points:0,
    inviterpoints:0,
    indirectinviterpoints:0,
    consumepoints:0,
    // 轮播参数
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

  bvRefresh(e) {
    _balancecheck()
    // wx.cloud.callFunction({
    //   name: "NormalQuery",
    //   data: {
    //     collectionName: e.currentTarget.dataset.name,
    //     command: "and",
    //     where: [{
    //       IndirectInviterId: 'omLS75T9_sWFA7pBwdg0uL6AUtcI',
    //       PointsStatus:'checked',
    //     }]
    //   },
    //   success: res => {
    //       this.setData({
    //         pointshistory: res.result.data
    //       })
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray,
      balance:app.globalData.Guserdata.TradeInfo.Balance,
      balanceupdatetime:app.globalData.Guserdata.TradeInfo.BalanceUpdateTime,
    })
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "POINTS",
      command: "and",
      where: [{
        SelfId: app.globalData.Guserid,
        PointsStatus:'checked',
      }]
    },
    success: res => {
    this.setData({
      personalhistory: res.result.data,
    })
  }
})
wx.cloud.callFunction({
  name: "NormalQuery",
  data: {
    collectionName: "POINTS",
    command: "and",
    where: [{
      InviterId: app.globalData.Guserid,
      PointsStatus:'checked',
    }]
  },
  success: res => {
  this.setData({
    inviterhistory: res.result.data,
  })
}
})
wx.cloud.callFunction({
  name: "NormalQuery",
  data: {
    collectionName: "POINTS",
    command: "and",
    where: [{
      IndirectInviterId: app.globalData.Guserid,
      PointsStatus:'checked',
    }]
  },
  success: res => {
  this.setData({
    indirectinviterhistory: res.result.data,
  })
}
})
wx.cloud.callFunction({
  name: "NormalQuery",
  data: {
    collectionName: "POINTS",
    command: "and",
    where: [{
      ConsumeId: app.globalData.Guserid,
      PointsStatus:'checked',
    }]
  },
  success: res => {
  this.setData({
    consumehistory: res.result.data,
  })
}
})
// 以下云数据库的异步积分计算,代码有效但暂不使用
// let p1=new Promise((resolve,reject)=>{
//   wx.cloud.callFunction({
//     name: "NormalQuery",
//     data: {
//       collectionName: "POINTS",
//       command: "and",
//       where: [{
//         UserId: app.globalData.Guserid,
//         PointsStatus:'checked',
//       }]
//     },
//     success: res => {
//       console.log(res)
//       let points1=0
//       for(let i =0;i<res.result.data.length;i++){
//         points1 += res.result.data[i].Points
//     }
//     this.setData({
//       personalhistory: res.result.data,
//       Points:points1
//     })
//     console.log("异步执行",this.data.Points)
//     resolve(this.data.Points);
//   },
//   fail: err => {
//     resolve(this.data.Points);
//   }
// })
// console.log("1执行了",this.data.Points)
// });

// let p2=new Promise((resolve,reject)=>{
//   wx.cloud.callFunction({
//     name: "NormalQuery",
//     data: {
//       collectionName: "POINTS",
//       command: "and",
//       where: [{
//         InviterId: app.globalData.Guserid,
//         PointsStatus:'checked',
//       }]
//     },
//     success: res => {
//       console.log(res)
//       let points2=0
//       for(let i =0;i<res.result.data.length;i++){
//         points2 += res.result.data[i].InviterPoints
//     }
//     this.setData({
//           inviterhistory: res.result.data,
//           inviterpoints:points2
//         })
//         console.log("异步执行",this.data.inviterpoints)
//         resolve(this.data.inviterpoints);
//     },
//     fail: err => {
//       resolve(this.data.inviterpoints);
//     }
//   })
//   console.log(this.data.inviterpoints)
//   console.log("2执行了")
// });
// let p3=new Promise((resolve,reject)=>{
//   wx.cloud.callFunction({
//     name: "NormalQuery",
//     data: {
//       collectionName: "POINTS",
//       command: "and",
//       where: [{
//         IndirectInviterId: app.globalData.Guserid,
//         PointsStatus:'checked',
//       }]
//     },
//     success: res => {
//       console.log(res)
//       let points3=0
//       for(let i =0;i<res.result.data.length;i++){
//         points3 += res.result.data[i].IndirectInviterPoints
//     }
//         this.setData({
//           indirectinviterhistory: res.result.data,
//           indirectinviterpoints:points3
//         })
//         console.log("异步执行",this.data.indirectinviterpoints)
//         resolve(this.data.indirectinviterpoints);
//     },
//     fail: err => {
//       // this.setData({
//       //   indirectinviterpoints:0
//       // })
//       resolve(this.data.indirectinviterpoints);
//     }

//   })
//   console.log(this.data.indirectinviterpoints)
//   console.log("3执行了")
// });
// let p4=new Promise((resolve,reject)=>{
//   wx.cloud.callFunction({
//     name: "NormalQuery",
//     data: {
//       collectionName: "POINTS",
//       command: "and",
//       where: [{
//         ConsumeId: app.globalData.Guserid,
//         PointsStatus:'checked',
//       }]
//     },
//     success: res => {
//       console.log(res)
//       let points4=0
//       for(let i =0;i<res.result.data.length;i++){
//         points4 += res.result.data[i].ConsumePoints
//     }
//         this.setData({
//           consumehistory: res.result.data,
//           consumepoints:points4
//         })
//         console.log("异步执行",this.data.consumepoints)
//         resolve(this.data.consumepoints);
//     },
//     fail: err => {
//       resolve(this.data.consumepoints);
//     }
//   })
//   console.log(this.data.consumepoints)
//   console.log("4执行了")
// });
// Promise.all([p1,p2,p3,p4]).then(res=>{
//   this.setData({
//     balance:this.data.Points+this.data.inviterpoints+this.data.indirectinviterpoints-this.data.consumepoints,
//   }),
//   console.log("balance执行了")
// });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
    	// 点击 tab 时用此方法触发埋点
	onTabItemTap: () => startToTrack(),
  onShow: function () {
    this.setData({
      avatarUrl: app.globalData.Guserdata.UserInfo.avatarUrl,
      nickName: app.globalData.Guserdata.UserInfo.nickName,
      userphone:app.globalData.Guserdata.UserInfo.UserPhone,
      image: app.globalData.Gimagearray
    })
    startToTrack()
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
    startByBack()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})