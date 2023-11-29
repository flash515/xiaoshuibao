// 云函数入口文件
//event.collectionName  //数据库表
//event.command  //查询指令
//event.where  //查询条件

const cloud = require('wx-server-sdk')

cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
  traceUser: true,
})
let orderbykey = "_id"
let orderby = "desc"
const db = cloud.database()
const _ = db.command
const MAX_LIMIT = 100
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if (event.orderbykey != undefined && event.orderbykey != '') {
    orderbykey = event.orderbykey
    orderby = event.orderby
  }
    //先取符合条件的记录总数
    const countResult = await db.collection(event.collectionName).where({
            //传入的条件参数
          Lon: _.gte(event.nowLon - event.range).and(_.lte(event.nowLon + event.range)),
          Lat: _.gte(event.nowLat - event.range).and(_.lte(event.nowLat + event.range)),
          //Status:"存续"
}).orderBy(orderbykey, orderby).count()
    const total = countResult.total
    // 计算需分几次取
    const batchTimes = Math.ceil(total / 100)
    // 承载所有读操作的 promise 的数组
    const tasks = []
    for (let i = 0; i < batchTimes; i++) {
      const promise = db.collection(event.collectionName).where({
            //传入的条件参数
            Lon: _.gte(event.nowLon - event.range).and(_.lte(event.nowLon + event.range)),
            Lat: _.gte(event.nowLat - event.range).and(_.lte(event.nowLat + event.range)),
            //Status:"存续"
          }).skip(i * MAX_LIMIT).limit(MAX_LIMIT).orderBy(orderbykey, orderby).get()
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