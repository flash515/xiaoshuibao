// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
  traceUser: true,
})
const db = cloud.database()
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  //先取符合条件的记录总数
  const countResult = await db.collection('USER').where({
    //传入的条件参数
    ["UserInfo.InviterId"]:event.userid,
  }).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
// 承载所有读操作的 promise 的数组
const tasks = []
for (let i = 0; i < batchTimes; i++) {
  const promise = db.collection('USER').where({
    //传入的条件参数
    ["UserInfo.InviterId"]:event.userid,
  }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
  tasks.push(promise)
}
// 等待所有
return (await Promise.all(tasks)).reduce((acc, cur) => {
  return {
    data: acc.data.concat(cur.data),
    errMsg: acc.errMsg,
  }
})
}