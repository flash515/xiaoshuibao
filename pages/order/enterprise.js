const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageParam:"",
    enterprisearray:[],
    enterprisedetail:[],
    enterprisename: "",
    enterpriseid: "",
    enterpriseaddress: "",
    enterprisephone: "",
    enterprisebank: "",
    enterprisebankaccount: "",
    sublock: false,
    // 轮播头图
    image: [],
  indicatorDots: true,
  vertical: false,
  autoplay: true,
  circular: true,
  interval: 4000,
  duration: 500,
  previousMargin: 0,
  nextMargin: 0
  },

  bvEnterpriseName(e) {
    this.setData({
      enterprisename: e.detail.value
    })
  },
  bvEnterpriseId(e) {
    this.setData({
      enterpriseid: e.detail.value
    })
  },
  bvEnterpriseAddress(e) {
    this.setData({
      enterpriseaddress: e.detail.value
    })
  },
  bvEnterprisePhone(e) {
    this.setData({
      enterprisephone: e.detail.value
    })
  },
  bvEnterpriseBank(e) {
    this.setData({
      enterprisebank: e.detail.value
    })
  },
  bvEnterpriseAccount(e) {
    this.setData({
      enterpriseaccount: e.detail.value
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
      db.collection("ENTERPRISE").add({
          data: {
            EnterpriseName: this.data.enterprisename,
            EnterpriseId: this.data.enterpriseid,
            EnterpriseAddress: this.data.enterpriseaddress,
            EnterprisePhone: this.data.enterprisephone,
            EnterpriseBank: this.data.enterprisebank,
            EnterpriseAccount: this.data.enterpriseaccount,
            AddDate:new Date().toLocaleDateString()
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
  // 异步读取数据方法
  async loadData() {
    this.setData({
      result: "正在读取数据."
    })
    // 获取数据库引用
    const db = wx.cloud.database()
    // 读取记录数数据
    await db.collection('ENTERPRISE').count().then(
      res => {
        this.setData({
          result: "云数据共有数据 " + res.total + " 条."
        })
      }
    )
    await db.collection("ENTERPRISE").where({
      EnterpriseName: 局
    }).get().then(
      res => {
        console.log(res)
      }
    )
  },
  updateData() {
    // 获取数据库引用
    const db = wx.cloud.database()
    db.collection('ENTERPRISE').doc(this.data.pageParam._id).update({
        data: {
          EnterpriseName: this.data.enterprisename,
          EnterpriseId: this.data.enterpriseid,
          EnterpriseAddress: this.data.enterpriseaddress,
          EnterprisePhone: this.data.enterprisephone,
          EnterpriseBank: this.data.enterprisebank,
          EnterpriseBankAccount: this.data.enterprisebankaccount,
          UpdateDate:new Date().toLocaleDateString()
        },
        success(res) {
          console.log("修改数据成功", res)
          wx.showToast({
            title: '信息修改成功',
            icon: 'success',
            duration: 2000 //持续的时间
          })
        },
        fail(res) {
          console.log("修改数据失败", res)
          wx.showToast({
            title: '不成功',
            icon: 'none',
            duration: 2000 //持续的时间
          })
        }
      })
},
  delData(e) {
    // 删除当前的ENTERPRISE
    const db = wx.cloud.database()
    db.collection('ENTERPRISE').where({
      _id: this.data.pageParam._id,
    }).remove({
      success: res => {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 2000 //持续的时间
        })
        console.log(删除成功);
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    this.setData({
      pageParam: options,
      image:app.globalData.Gimagearray
    })
    console.log("pageParam",this.data.pageParam._id);

},
onShow: function () {
  // 从本地存储中读取
  wx.getStorage({
    key:'LEnterprise',
    success: res => {
     this.setData({
       enterprisearray: res.data
     })
     console.log("enterprise",this.data.enterprisearray)//Object {errMsg: "getStorage:ok", data: "value1"}
             // 筛选指定记录
             var fliter = [];
             // var _this = this
             for (var i = 0; i < this.data.enterprisearray.length; i++) {
               if (this.data.enterprisearray[i]._id == this.data.pageParam._id) {
                fliter.push(this.data.enterprisearray[i]);
               }
             }
             console.log(fliter);
             this.setData({
               enterprisedetail: fliter,
               adddate: fliter[0].AddDate,
               enterprisename:fliter[0].EnterpriseName,
               enterpriseid: fliter[0].EnterpriseId,
               enterpriseaddress: fliter[0].EnterpriseAddress,
               enterprisephone: fliter[0].EnterprisePhone,
               enterprisebank: fliter[0].EnterpriseBank,
               enterprisebankaccount: fliter[0].EnterpriseBankAccount,
               updatedate:fliter[0].UpdateDate
              })

    },
  
   })

},
})