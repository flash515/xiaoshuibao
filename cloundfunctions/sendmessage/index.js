// 云函数入口文件
const cloud = require('wx-server-sdk')
const QcloudSms = require("qcloudsms_js")
const appid = "1400531781" // 替换成您申请的云短信 AppID 以及 AppKey
const appkey = "acb976a3b5503d9ac47d84384f3dd90c"
// const templateId = "985130" // 替换成您所申请模板 ID
const smsSign = "小税宝" // 替换成您所申请的签名

cloud.init({
  env: 'xsbmain-9gvsp7vo651fd1a9',
  traceUser: true,
})
// 生成6位数验证码 
var code = "";
for (var i = 0; i < 6; i++) {
  var radom = Math.floor(Math.random() * 10);
  code += radom;
}
// 云函数入口函数
exports.main = async (event, context) => new Promise((resolve, reject) => {
  /*单发短信示例为完整示例，更多功能请直接替换以下代码*/
  if (event.nocode==true){
    var params = []
  }else{
    var params = [code]
  }
  var qcloudsms = QcloudSms(appid, appkey);
  var ssender = qcloudsms.SmsSingleSender();
  // 获取发送短信的手机号码
  var mobile = event.mobile
  var templateId = event.templateId
  // 获取手机号国家/地区码
  var nationcode = event.nationcode
  ssender.sendWithParam(nationcode, mobile, templateId, params, smsSign, "", "", (err, res, resData) => {
    /*设置请求回调处理, 这里只是演示，您需要自定义相应处理逻辑*/
    if (err) {
      console.log("err: ", err);
      reject({
        err
      })
    } else {
      resolve({
        res: res.req,
        resData
      })
    }
  });

})