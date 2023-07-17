const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//判断两个时间比较大小
function compareDate(d1, d2) {
  return ((new Date(d1.replace(/-/g, "\/"))) > (new Date(d2.replace(/-/g, "\/"))));
}


//当前服务器时间获取
function getServerTime() {
  var promise = new Promise((resolve, reject) => {
    wx.request({
      url: 'https://api.weixin.qq.com', //仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        console.log("服务器0时区时间",res.header.Date)
        var date = new Date(res.header.Date)
        console.log("转为东八区时间",date)
        var year = date.getFullYear();
        var mouths = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
        var day = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
        var hours = date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours(); //当前时
        var minutes = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes(); //当前分
        var second = date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds(); //当前秒
        var servertime = year.toString() + "-" + mouths.toString() + "-" + day.toString() + "\t" + hours.toString() + ":" + minutes.toString() + ":" + second.toString();
        console.log(servertime)
        resolve(servertime)
      }
    })
  });
  return promise;
}

//当前时间获取
function getCurrentTime() {
  var date = new Date()
  var year = date.getFullYear();
  var mouths = (date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1);
  var day = date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate();
  var hours = date.getHours() < 10 ? ("0" + date.getHours()) : date.getHours(); //当前时
  var minutes = date.getMinutes() < 10 ? ("0" + date.getMinutes()) : date.getMinutes(); //当前分
  var second = date.getSeconds() < 10 ? ("0" + date.getSeconds()) : date.getSeconds(); //当前秒
  var currenttime = year + "-" + mouths + "-" + day + "\t" + hours + ":" + minutes + ":" + second;
  return currenttime
}

/**
 * 传入时间后几天
 * param：传入时间：dates:"2018-04-02",later:往后多少天
 */
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  dateObj.dates = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "月" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + "日";
  dateObj.newdates = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "-" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.year = date.getFullYear();
  dateObj.month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  dateObj.day = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.week = show_day[day];
  return dateObj;
}

module.exports = {
  formatTime: formatTime,
  compareDate: compareDate,
  getServerTime: getServerTime,
  getCurrentTime: getCurrentTime,
  dateLater: dateLater
}