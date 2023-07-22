// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection(event.collectionName).where({
      _id: event.id,
    }).update({
      data: {
        ReplyDate:new Date(),
        ReplyStatus:"unchecked",
        [event.key1]: event.value1,
      }
    })
  } catch (e) {
    console.log(e)
  }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}