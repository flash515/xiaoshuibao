// pages/test/test.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attachmentfile: [],
    attachment: [],
    category1: "",
    category2: "",
    category3: "",
    multiArray: [
      ['无脊柱动物', '脊柱动物'],
      ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'],
      ['猪肉绦虫', '吸血虫']
    ],
    multiIndex: [0, 0, 0],

    objectArray: [{
        id: 5,
        unique: 'unique_5'
      },
      {
        id: 4,
        unique: 'unique_4'
      },
      {
        id: 3,
        unique: 'unique_3'
      },
      {
        id: 2,
        unique: 'unique_2'
      },
      {
        id: 1,
        unique: 'unique_1'
      },
      {
        id: 0,
        unique: 'unique_0'
      },
    ],
    numberArray: [1, 2, 3, 4]
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value,

    })
  },
  bvTest(){
let category="天气很好"
let cate=["Categoryname",category]
let ca=[]
ca.push(cate)
console.log(ca)

  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          // 以下的每一个case对应是第一列每个值第二列的全部，第三列是第二列第一值的子项
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              // 第一列是第一个值，以下每一个case是在第三列中展示第二列值的每一个子项
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;
              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              // 第一列是第二个值，以下每一个case是在第三列中展示第二列值的每一个子项
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    console.log(data.multiIndex);
    this.setData(data);
    this.setData({
      category1: data.multiArray[0][data.multiIndex[0]],
      category2: data.multiArray[1][data.multiIndex[1]],
      category3: data.multiArray[2][data.multiIndex[2]],
    })


  },
  switch: function (e) {
    const length = this.data.objectArray.length
    for (let i = 0; i < length; ++i) {
      const x = Math.floor(Math.random() * length)
      const y = Math.floor(Math.random() * length)
      const temp = this.data.objectArray[x]
      this.data.objectArray[x] = this.data.objectArray[y]
      this.data.objectArray[y] = temp
    }
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addToFront: function (e) {
    const length = this.data.objectArray.length
    this.data.objectArray = [{
      id: length,
      unique: 'unique_' + length
    }].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  addNumberToFront: function (e) {
    this.data.numberArray = [this.data.numberArray.length + 1].concat(this.data.numberArray)
    this.setData({
      numberArray: this.data.numberArray
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bvChooseImage(e) {
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvRemoveImage(e) {
    this.setData({
      attachmentview: e.detail.all,
      imageuploadlock: false
    })
  },
  bvUploadImage(e) {
    let that = this
    // 判断商品id是否空值
    if (this.data.productid == "" || this.data.productid == null) {
      wx.showToast({
        title: "商品编号不能为空",
        icon: 'none',
        duration: 2000
      })
    } else {
      // 判断是否重复提交
      if (this.data.imageuploadlock) {
        // 锁定时很执行
        wx.showToast({
          title: '请勿重复提交',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      } else {
        if (this.data.attachmentview.length == 0) {
          this.data.attachmentimage = []
        } else {
          for (let i = 0; i < this.data.attachmentview.length; i++) {
            const filePath = this.data.attachmentview[i]
            const cloudPath = 'product/' + this.data.productid + '/' + this.data.productid + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log("fileID", res.fileID)
                this.data.attachmentimage = this.data.attachmentimage.concat(res.fileID)
              }
            })
          }

        }
        this.data.imageuploadlock = true // 修改上传状态为锁定
        console.log("attachmentimage", that.data.attachmentimage)
        // 异步上传，打印attachment时尚未返回数据
      }
    }
  },


  bvChooseFile(e) {
    wx.chooseMessageFile({
      count: 4,
      type: 'file',
      success: res => {
        console.log("res.tempFiles", res.tempFiles)
        // tempFilePath可以作为img标签的src属性显示图片
        this.setData({
          tempFilePaths: res.tempFiles
        })
      }
    })
  },
  bvUploadFile(e) {
    // 判断individualname是否空值
    if (this.data.productid == "" || this.data.productid == null) {
      wx.showToast({
        title: "请先填写商品编号后再尝试上传资料",
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
              let s = str.lastIndexOf('.') //找到最后一次出现点号的位置
              let filename = str.substring(0, s) //取点号前的字符
              console.log("filename", filename)
              var obj = new Object();
              obj = {
                [filename]: res.fileID
              }
              // 构建数组并合并起来
              this.data.attachmentfile.push(obj)
              // this.data.attachmentfile = Object.assign(this.data.attachmentfile, obj)
              wx.showToast({
                title: this.data.tempFilePaths[i].name + '上传成功',
                icon: 'none',
                duration: 2000 //持续的时间
              })
            },
            complete: res => {
              console.log(res)
            }
          })
        }

        this.data.fileuploadlock = true // 修改上传状态为锁定
        console.log("attachmentfile", this.data.attachmentfile)
        // 异步上传，打印attachment时尚未返回数据
      }
    }

  },

  bvDeleteFile(e) {
    console.log(this.data.attachmentfile)
    wx.cloud.deleteFile({
      //微信云储存中的文件唯一身份fileID，最多可删除50条
      fileList: [e.currentTarget.dataset.link],
      success: (res => {
        console.log(res)
        // 注意这里数组删除方法的细节，splice删除完以后还要setDate重新赋值才可以
        this.data.attachmentfile.splice([e.currentTarget.dataset.name], 1)
        this.setData({
          attachmentfile: this.data.attachmentfile
        })
        console.log("修改后this.data.attachmentfile", this.data.attachmentfile)
      }),
      fail: (err => {
        console.log(err)
      })
    })
    console.log(this.data.attachmentfile)
  },
  bvDownloadFile(e) {
    console.log(e.currentTarget.dataset.link)
    // get temp file URL
    wx.cloud.downloadFile({
      fileID: e.currentTarget.dataset.link,
      success: res => {
        // get temp file path
        wx.openDocument({
          filePath: res.tempFilePath,
          showMenu: true, // 重点是这一步，即打开手机端预览文件时右上角三个点，点击可以保存到本地或者分享给好友
          success: res2 => {
            console.log('打开文件成功', res2)
          },
          fail: fres => {
            console.log('打开文件失败', res2)
          },
        })

      },
      fail: err => {
        console.log(err)
      }
    })

  },
  // 异步新增数据方法
  addData() {
    // 判断是否重复提交
    if (this.data.sublock) {
      // 锁定时很执行
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 2000 //持续的时间
      })
    } else {
      // 未锁定时执行
      // 获取数据库引用
      const db = wx.cloud.database()
      // 新增数据
      db.collection("PRODUCT").add({
          data: {
            AddDate: new Date().toLocaleDateString(),
            Status: this.data.status,
            ProductId: this.data.productid,
            ProductType: this.data.producttype,
            ProductName: this.data.productname,

            Category1: this.data.category1,
            Category2: this.data.category2,
            Category3: this.data.category3,
            ServiceArea: this.data.servicearea,
            HandlePlace: this.data.handleplace,

            AttachmentImage: this.data.attachmentimage,
            AttachmentFile: this.data.attachmentfile,
          },
          success(res) {
            console.log('新增数据成功', res.data)
            wx.showToast({
              title: '新增数据成功',
              icon: 'success',
              duration: 2000 //持续的时间
            })
          },
          fail(res) {
            console.log("新增数据失败", res)
            wx.showToast({
              title: '新增数据失败',
              icon: 'fail',
              duration: 2000 //持续的时间
            })
          }
        }),
        // 以上新增数据结束
        this.data.sublock = true // 修改上传状态为锁定
    }
  },
  // 更新数据
  updateData() {
    // 获取数据库引用
    const db = wx.cloud.database()
    // 更新数据
    wx.cloud.callFunction({
      name: 'NormalUpdate',
      data: {
        id: "5464a294625e291c0108331c61f57434",
        key1: "AttachmentFile",
        value1: this.data.attachmentfile,
        key2: "UpdateDate",
        value2: new Date(),
      },
      success: res => {
        console.log("执行了")
      }
    })
    // 以上更新数据结束
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //页面初始化 options为页面跳转所带来的参数
    var that = this;
    // this.setData({
    //   recordid: options.recordid,
    //   usertype: app.globalData.Guserinfo.UserType,
    //   sortarray: app.globalData.Gsortarray,
    //   // category1: app.globalData.Gsortarray[0].Category1Name,
    //   // category2: app.globalData.Gsortarray[0].Category2Array[0].Category2Name,
    //   // category3: app.globalData.Gsortarray[0].Category2Array[0].Category3Array[0].Category3Name,
    // })
    wx.cloud.callFunction({
      name: "NormalQuery",
      data: {
        collectionName: "PRODUCT",
        command: "and",
        where: [{
            _id: "5464a294625e291c0108331c61f57434"
          },
          {
            Status: "在售"
          }
        ]
      },
      success: res => {
        this.setData({
          productlist: res.result.data,
          productarray: res.result.data,
          recordid: res.result.data[0]._id,
          adddate: res.result.data[0].AddDate,
          status: res.result.data[0].Status,
          productid: res.result.data[0].ProductId,
          producttype: res.result.data[0].ProductType,
          productname: res.result.data[0].ProductName,
          updatedate: res.result.data[0].UpdateDate,
          attachmentview: res.result.data[0].AttachmentImage,
          attachmentfile: res.result.data[0].AttachmentFile,
          username: res.result.data[0]._openid,

        })
        console.log(res.result.data[0].AttachmentFile)
        console.log("this.data.attachmentfile", this.data.attachmentfile)
      }
    })


  },

sendlogin(){
  wx.cloud.callFunction({
    name: 'sendsms',
    data: {
      templateId:"1569087",
      nocode:true,
      mobile: [13025400559,18954744612]

    },
    success: res => {
      console.log(res)
    },
    fail: res => {
      console.log(res)
    },
    complete:res => {
      console.log(res)
    },
  })
},
sendliuyan(){
  wx.cloud.callFunction({
    name: 'sendmessage',
    data: {
      templateId:"1569089",
      nocode:true,
      mobile: 13025400559,
      nationcode: '86'
    },
    success: res => {
      console.log(res)
    },
    fail: res => {
      console.log(res)
    },
    complete:res => {
      console.log(res)
    }
  })
},
sendorder(){
  wx.cloud.callFunction({
    name: 'sendmessage',
    data: {
      templateId:"1569097",
      nocode:true,
      mobile: 18954744612,
      nationcode: '86'
    },
      success: res => {
        console.log(res)
      },
      fail: res => {
        console.log(res)
      },
      complete:res => {
        console.log(res)
      },
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const url = `/${currentPage.route}`
    console.log(url)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.Guserinfo.nickName + '邀请您体验：',
      path: '/pages/index/index?userid='+app.globalData.Gopenid + "&page=" + url,
      imageUrl: '', //封面
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(this.data.path.value)
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
        }
      },
    }
  }
})