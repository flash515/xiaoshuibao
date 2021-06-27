const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播参数
  image: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 4000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    payeearray: [],
    payerarray: []
  },
    bvAddressee(e) {
      this.setData({
        addressee: e.detail.value
      })
    },
    bvAddresseePhone(e) {
      this.setData({
        addresseephone: Number(e.detail.value)
      })
    },
    bvAddress(e) {
      this.setData({
        address: e.detail.value
      })
    },
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
        db.collection('ADDRESS').add({
            data: {
              Addressee: this.data.addressee,
              AddresseePhone: this.data.addresseephone,
              Address: this.data.address,
              AddDate: new Date().toLocaleDateString()
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
                icon: 'none',
                duration: 2000 //持续的时间
              })
            }
          }),
          this.data.sublock = true // 修改上传状态为锁定
      }
    },
    updateData() {
      // 获取数据库引用
      const db = wx.cloud.database()
      db.collection('ADDRESS').doc(this.data.pageParam._id).update({
        data: {
          Addressee: this.data.addressee,
          AddresseePhone: this.data.addresseephone,
          Address: this.data.address,
          UpdateDate: new Date().toLocaleDateString()
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
      // 删除当前的PAYEE
      const db = wx.cloud.database()
      db.collection('ADDRESS').where({
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pageParam: options,
      image:app.globalData.Gimagearray
    })
    console.log("pageParam", this.data.pageParam._id);
    console.log("pageParam.length", options.length);
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
    if(this.data.pageParam._id){
      // 从本地存储中读取
      wx.getStorage({
        key: 'LAddress',
        success: res => {
          this.setData({
            addressarray: res.data
          })
          console.log("address", this.data.addressarray) //Object {errMsg: "getStorage:ok", data: "value1"}
          // 筛选指定记录
          var fliter = [];
          // var _this = this
          for (var i = 0; i < this.data.addressarray.length; i++) {
            if (this.data.addressarray[i]._id == this.data.pageParam._id) {
              fliter.push(this.data.addressarray[i]);
            }
          }
          console.log(fliter);
          this.setData({
            adddate: fliter[0].AddDate,
            addressee: fliter[0].Addressee,
            addresseephone: fliter[0].AddresseePhone,
            address: fliter[0].Address,
            updatedate: fliter[0].UpdateDate
          })
        },
      })
    }
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