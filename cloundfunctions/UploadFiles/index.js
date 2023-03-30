// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
  traceUser: true,
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var tempimages = []
  for (let i = 0; i < event.imageview.length; i++) {
    var promise = new Promise((resolve, reject) => {
      const filePath = event.imageview[i]
      const cloudPath = event.cloudpath + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
      cloud.uploadFile({
        cloudPath,
        filePath,
        success: res => {
          resolve(res.fileID)
        }
      })
    });
    tempimages = tempimages.concat((await promise).data)
  }
  return {
    tempimages,
    event,
    
  }
}