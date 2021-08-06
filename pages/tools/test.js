// pages/tools/test.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 全部直接推荐人数
    userarray: [],
    // 直接推荐用户数组
    directuser: [],
    sharevalue: 0,
    sharevaluearray: [],
    // 30天直接推荐人数
    direct30user: [],
    sharingvalue: 0,
    enddate: "",
    enddate1: "",
    enddate2: "",
    enddate3: "",
    tempphotourls: [],
    idphotos: [],
    tempimageurls: [],
    userid: "",
    imageuploadlock: false,
    //渲染
    orderarray: [],
    tempFilePaths: [],
    fileuploadlock: false,
    attachmentfile: {},
    productid: "test",

  },
  bvEndDate(e) {
    console.log(e.detail)

    this.setData({
      enddate: e.detail.value,
      // enddate3:new Date(string)
    })
    console.log("录入时间", this.data.enddate)

    let enddate3 = (this.data.enddate).replace(/-/g, '/');
    console.log("选定日期斜杠替换横杠", enddate3)

    var enddate4 = new Date(enddate3).getTime();
    console.log("选定日期，经过斜杠替换横杠，再转成时间戳", enddate4)

    var enddate6 = new Date(this.data.enddate).getTime();
    console.log("选定日期，直接横杠时间戳，常用", enddate6)

    let enddate1 = new Date()
    console.log("当前日期时间，服务器格式", enddate1)

    var enddate5 = new Date().getTime();
    console.log("当前日期时间戳，常用", enddate5)

    var date = new Date();
    var myDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    console.log("当前日期,转换成字符串，横杠模式", myDate)

    let enddate2 = new Date().toLocaleDateString()
    console.log("当前日期，转字符串,斜杠格式", enddate2)

    var enddate7 = new Date(enddate2).getTime();
    console.log("enddate2当前日期转字符串后改时间戳7", enddate7)

    let tm = "2019-07-24 19:57"
    let dt = new Date(tm.replace(/-/g, '/'))
    console.log("tm-dt", dt)

  },
  onChangeTap(e) {
    console.log("event.detail", e.detail)
    this.setData({
      tempphotourls: e.detail.all
    })
  },
  onRemove(e) {
    console.log("event.detail", e.detail)
    this.setData({
      tempphotourls: e.detail.all,
      idphotos: [],
      imageuploadlock: false
    })
  },
  query(e) {
    wx.cloud.callFunction({
      name: 'ShareUserQuery',
      data: {
        userid: "omLS75Xib_obyxkVAahnBffPytcA",
      },
      complete: res => {
        this.setData({
          directuser: res.result.data,
        })
        console.log("云函数查询", res.result.data)
      }
    })
  },
  Lvaluequery(e) {
    const db = wx.cloud.database()
    let temparray = []
    for (let i = 0; i < this.data.directuser.length; i++) {
      db.collection('ORDER').where({
        //传入的条件参数
        _openid: this.data.directuser[i]._openid,
        // _openid: "omLS75T9_sWFA7pBwdg0uL6AUtcI"
      }).get({
        success: res => {
          console.log("结果", res.data)
          console.log("价值", res.data[0].TotalFee)
          temparray = temparray.concat(res.data)
          console.log("赋值结果", temparray)
          // temp.push(res.data) //push是整体赋值
          wx.setStorageSync('Lorderarray', temparray);
        }
      })
      // temp=temp.concat(res.data)
    }
    // wx.setStorageSync('Lorderarray', this.data.temp);//放在这里取不到值，可能是异步的原因

  },

  bvValueQuery(e) {
    // 云函数测试成功
    wx.cloud.callFunction({
      name: 'ShareValueQuery',
      data: {
        userarray: this.data.directuser
      },
      complete: res => {
        // 取回结果后再作整理
        var temparray = []
        for (let i = 0; i < res.result.length; i++) {
          temparray = temparray.concat(res.result[i].data)
        }
        console.log("1云函数查询结果", res)
        console.log("2云函数查询结果数据", res.result)
        console.log("3云函数查询整理后数据", temparray)

      }
    })
  },
  bvView(e) {
    // 从本地存储中读取
    wx.getStorage({
      key: 'Lorderarray',
      success: res => {
        this.setData({
          orderarray: res.data
        })
        let fee = 0
        for (let i = 0; i < this.data.orderarray.length; i++) {
          fee = fee + parseInt(this.data.orderarray[i].TotalFee)
        }
        console.log("云函数价值查询", fee)
      }
    })

  },

  chooseMedia() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image', 'video'],
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: res => {
        console.log(res)
        console.log(res.tempFiles[0].tempFilePath)

        // //有效
        // this.setData({
        //   tempimageurls: res.tempFiles
        // })

        this.data.tempphotourls = res.tempFiles
        console.log("这个", this.data.tempphotourls)
        var imgfliter = [];
        for (let i in this.data.tempphotourls) {
          imgfliter.push(this.data.tempphotourls[i].tempFilePath);
        }
        this.setData({
          tempimageurls: imgfliter
        })
        // this.data.tempimageurls=imgfliter
        console.log("标记", this.data.tempimageurls);
        // console.log("标记d",tempimageurls);

      },
      complete(res) {
        console.log('complete', res)
      }
    })
  },
  upload(e) {
    // 判断是否重复提交
    if (this.data.imageuploadlock) {
      // 锁定时很执行
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      for (let i = 0; i < this.data.tempphotourls.length; i++) {
        const filePath = this.data.tempphotourls[i]
        const cloudPath = app.globalData.Gopenid + '/' + (new Date()).getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date()).getDate() + '/' + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log("fileID", res.fileID)
            this.data.idphotos = this.data.idphotos.concat(res.fileID)
          }
        })
      }
      this.data.imageuploadlock = true // 修改上传状态为锁定
    }
    console.log("idphotos", this.data.idphotos)
    // 异步上传，打印idphotos时尚未返回数据
  },

  bvUploadFile(e) {
    // 判断individualname是否空值
    if (this.data.productid == "" || this.data.productid == null) {
      wx.showToast({
        title: "请先填写产品编号后再尝试上传资料",
        icon: 'none',
        duration: 2000
      })
    } else {
      // 判断是否重复提交
      if (this.data.fileuploadlock) {
        // 锁定时很执行
        wx.showToast({
          title: '请勿重复提交',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      } else {
        for (let i = 0; i < this.data.tempFilePaths.length; i++) {
          const filePath = this.data.tempFilePaths[i].path
          const cloudPath = 'product/' + this.data.productid + '/' + this.data.tempFilePaths[i].name
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              let str = String(this.data.tempFilePaths[i].name) //字符串，想要的是以下划线截取前后的字符
              console.log("str",str)
              let s = str.lastIndexOf('.') //找到最后一次出现点号的位置
              let filename = str.substring(0,s) //取点号前的字符
              console.log("filename",filename)
              var obj = new Object();
              // obj= {[this.data.tempFilePaths[i].name]:res.fileID} //有效，重要
              obj = { // 有效
                [filename]: res.fileID
              }
              
              console.log("fileID", res.fileID)
              console.log("obj", obj)
              this.data.attachmentfile = Object.assign(this.data.attachmentfile, obj)
            }
          })
        }
        this.data.fileuploadlock = true // 修改上传状态为锁定
        console.log("attachmentfile", this.data.attachmentfile)
        // 异步上传，打印attachment时尚未返回数据
      }
    }

  },
  bvChooseFile(e) {
    wx.chooseMessageFile({
      count: 4,
      type: 'file',
      success: res => {
        console.log("res.tempFiles", res)
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          tempFilePaths: res.tempFiles
        })
      }
    })
  },
  bvUrlLink(e) {
    // 云函数测试成功
    wx.cloud.callFunction({
      name: 'URLLink',
      data: {

      },
      complete: res => {

        console.log("1云函数查询结果", res)
        console.log("2云函数查询结果数据", res.result)

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})