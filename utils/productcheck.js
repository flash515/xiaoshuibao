// 新建页面埋点
const app = getApp()

function _productcheck() {
  console.log("productcheck执行了")
  let p = new Promise((resolve, reject) => {
  wx.cloud.callFunction({
    name: "NormalQuery",
    data: {
      collectionName: "PRODUCT",
      command: "or",
      where: [{
        Status: "在售"
      }]
    },
    success: res => {
      app.globalData.Gproduct = res.result.data
      console.log(app.globalData.Gproduct)
      resolve(app.globalData.Gproduct);
    }
  })
});
Promise.all([p]).then(res => {
  return app.globalData.Gproduct
})
}

module.exports = {
  _productcheck:_productcheck,
}