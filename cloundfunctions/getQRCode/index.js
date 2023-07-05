// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9'
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let param = {
      // 小程序传入的 scene 参数
      scene: event.scene,
      // 可以换成任意 page
      page: event.page,
      // 生成透明底色
      isHyaline: true,
      // 是否使用自动颜色
      autoColor: false,
      // 自定义颜色,rgb不能超过185，不然生成的码不能被识别，所以将自动转为黑色码
      lineColor: event.color
    }
    let wxContext = cloud.getWXContext();  //共享云环境下需要给appid赋值
    let fromAppId = wxContext.FROM_APPID;  //共享云环境下需要给appid赋值
    // 调用接口
    var result = await cloud.openapi({
      appid: fromAppId  //共享云环境下需要给appid赋值
    }).wxacode.getUnlimited(param)
    // 生成的小程序码是buffer格式，需要先将buffer保存至云存储空间生成图片再操作
    const upload = await cloud.uploadFile({
      cloudPath: event.path,
      fileContent: result.buffer,
    })
    let qrcodefileID = upload.fileID
    return qrcodefileID
    return result
  } catch (err) {
    return err
  }
}