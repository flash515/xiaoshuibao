// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {  env:'xsbmain-9gvsp7vo651fd1a9'}
  )

// 云函数入口函数
exports.main = async(event, context) => {
  try {
    let param = {
      // 小程序传入的 scene 参数
      scene: event.scene,
      // 可以换成任意 page
      page: event.page,
      is_hyaline:true,
    };
    // 调用接口
    var result = await cloud.openapi.wxacode.getUnlimited(param)
        // 将资源上传至云存储空间
        const upload = await cloud.uploadFile({
          cloudPath: event.userid+'/'+'tempqrcode.png',
          fileContent: result.buffer,
        })
        let qrcodefileID = upload.fileID
        return qrcodefileID
    return result
  } catch (err) {
    return err
  }
}