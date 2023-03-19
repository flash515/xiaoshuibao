// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
  traceUser: true,
})
const wxContext = cloud.getWXContext()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {

  try{
  return await db.collection(event.collectionName).where({
    [event.key]:event.id
  }).update({
    data: {
      [event.key1]: event.value1,
      [event.key2]: event.value2,
    }
  })
}catch (e) {
  console.log(e)
}
}