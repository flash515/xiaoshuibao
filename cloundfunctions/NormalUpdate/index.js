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
//   switch (event.command) {   
//     case"or":{
//       return updateByWhere({
//         collectionName: event.collectionName,
//         where: event.where,
//         command:db.command.or
//       })
//     }
//     case"and":{
//       return updateByWhere({
//         collectionName: event.collectionName,
//         where: event.where,
//         command:db.command.and
//       })
//     }
//     case"":{
//       return updateByWhere({
//         collectionName: event.collectionName,
//         where: event.where,
//         command:db.command.and
//       })
//     }
//   }
//   async function updateByWhere(param){
//     const com = param.command
//   //先取符合条件的记录总数
//   const countResult = await db.collection(param.collectionName).where(
//     com(param.where)
//       //传入的条件参数
//   ).update({
//     data: {
//       [event.key1]: event.value1,
//       [event.key2]: event.value2,
//     }
//   })
 
// }
  try{
  return await db.collection('PRODUCT').where({
    _id:event.id
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