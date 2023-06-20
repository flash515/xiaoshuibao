// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境
var rp = require("request-promise")
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var options = {
    uri: 'https://api.weixin.qq.com/sns/jscode2session',
    qs: {
      js_code: event.code,
      appid: "wxf43d2aed3e5b6370",
      secret: "f880fc2af3f06d340166b0750cac2a78",
      grant_type: "authorization_code"
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
  };
  return rp(options)
    .then(function (res) {
      console.log(res);
      return res;
    })
    .catch(function (err) {
      console.log(err);
    });
}