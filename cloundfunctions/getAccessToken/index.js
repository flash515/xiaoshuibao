
// 云函数入口文件

const cloud = require('wx-server-sdk')
const request = require('request')
const access_token = require('AccessToken');//引入AccessToken类
cloud.init(
{  env:'xsbmain-9gvsp7vo651fd1a9'}
)
let appid ='wx810b87f0575b9a47';//微信公众号开发者id
let secret ='c261e557e8744f87e2ed2dbea66ed75b';//微信公众号开发者secret_key
// 云函数入口函数
exports.main = async (event, context) => {
  let at = new access_token({
    appid,
    secret
  });
  return at.getCachedWechatAccessToken();
}