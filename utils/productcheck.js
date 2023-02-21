// 新建页面埋点
const app = getApp()

function _productcheck() {
  console.log("productcheck执行了")
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
      return res
    }
});
}

module.exports = {
  _productcheck:_productcheck,
}