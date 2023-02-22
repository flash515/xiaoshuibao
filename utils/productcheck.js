// 新建页面埋点
const app = getApp()

function _productcheck(callback) {
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
      console.log(res.result)
      callback(res.result.data)
    }
  });
}

module.exports = {
  _productcheck: _productcheck,
}