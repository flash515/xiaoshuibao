// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: 'xsbmain-9gvsp7vo651fd1a9' }) // 使用当前云环境
var xlsx = require('node-xlsx');
const db = cloud.database()
exports.main = async(event, context) => {
  // let {
  //   fileID
  // } = event
  //1,通过fileID下载云存储里的excel文件
  const res = await cloud.downloadFile({
    fileID: event.fileID,
  })
  const buffer = res.fileContent
  const all_excel_data = [] //用来存储所有的excel数据
  //2,解析excel文件里的数据
  var sheets = xlsx.parse(buffer); //获取到所有sheets
  sheets.forEach(function(sheet) {
    console.log(sheet['name']);
    for (var rowId in sheet['data']) {
      //console.log(rowId);
      var row = sheet['data'][rowId]; //第几行数据
      if (rowId > 0 && row) { //第一行是表格标题，所以我们要从第2行开始读
        //3，把解析到的数据存到excelList数据表里
        all_excel_data.push({
          Type: row[0], //客户类别
          Status: row[1],
          Remark: row[2],
          Company: row[3], //公司名称
          CompanyId: row[4], //信用代码
          Representative: row[5], //法定代表人
          Tel: row[6], //联系电话
          MoreTel: row[7], //其他电话
          Province: row[8], //其他电话
          City: row[9], //其他电话
          District: row[10], //其他电话
          Address: row[11], //地址
          Lon: row[12], //经度
          Lat: row[13], //纬度
          Scope: row[14], //经营范围
     })
      }
    }
  });
  // 一起添加所有数据
  var result=await db.collection('CLIENT').add({data:all_excel_data}).then(res=>{
    return res
  }).catch(err=>{return err})
  return result
}