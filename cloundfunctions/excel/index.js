const cloud = require('wx-server-sdk')
cloud.init({env: 'xsbmain-9gvsp7vo651fd1a9'}) // 使用当前云环境
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
          CompanyName: row[0], //企业名称
          Category1: row[1], //一级分类
          Category2: row[2], //二级分类
          Address: row[3], //地址
          WebSite: row[4], //网站
          Telephone: row[5], //电话
          Email: row[6], //email
          BusinessScope: row[7], //经营范围
        })
      }
    }
  });
  // 一起添加所有数据
  var result=await db.collection('NAMECARD').add({data:all_excel_data}).then(res=>{
    return res
  }).catch(err=>{return err})
  return result
}