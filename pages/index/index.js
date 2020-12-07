//index.js
//获取应用实例
const app = getApp()

Page({
    click: function() {
    wx.navigateTo({
    url:'../index/qiye.wxml'
    })
    },
onShareAppMessage: function (res) 
{
  if (res.from === 'button') {
    // 来自页面内转发按钮
    console.log(res.target)
  }
  return {
    title: '自定义转发标题',
    path: '/pages/index/index?id=123',
    // imageUrl:''  //封面
  }
},
onLoad: function (query) {
  //获取路径中的参数
  console.log(query)
  //请求后端
}
})
