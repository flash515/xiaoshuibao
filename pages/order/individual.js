  const app = getApp()
  Page({
    /**
     * 页面的初始数据
     */
    data: {
      pageParam: "",
      individualarray: [],
      individualname: "",
      individualphone: "",
      individualaddress: "",
      taxaccount: "",
      taxpassword: "",
      attachmentview: [], //用于展示数据库中的图片
      attachmentimage: [], //数据库中的图片
      imageuploadlock: false,
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
    // 通过事件绑定用户姓名值
    bvIndividualName(e) {
      this.setData({
        individualname: e.detail.value
      })
    },
    // 通过事件绑定用户手机值
    bvIndividualPhone(e) {
      this.setData({
        individualphone: e.detail.value
      })
    },
    bvIndividualAddress(e) {
      this.setData({
        individualaddress: e.detail.value
      })
    },
    bvTaxAccount(e) {
      this.setData({
        taxaccount: e.detail.value
      })
    },
    bvTaxPassword(e) {
      this.setData({
        taxpassword: e.detail.value
      })
    },
    onChangeTap(e) {
      this.setData({
        attachmentview: e.detail.all,
        imageuploadlock: false
      })
    },
    onRemoveAttachmentImage(e) {
      this.setData({
        attachmentview: e.detail.all,
        imageuploadlock: false
      })
    },
    onUploadAttachmentImage(e) {
      let that = this
      // 判断individualname是否空值
      if (this.data.individualname == "" || this.data.individualname == null) {
        wx.showToast({
          title: "请先填写开票人姓名后再尝试上传资料",
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
          for (let i = 0; i < this.data.attachmentview.length; i++) {
            const filePath = this.data.attachmentview[i]
            const cloudPath = app.globalData.Gopenid + '/individual/' + this.data.individualname + '/' + this.data.individualname + (new Date()).getTime() + filePath.match(/\.[^.]+?$/)
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log("fileID", res.fileID)
                this.data.attachmentimage = this.data.attachmentimage.concat(res.fileID)
              }
            })
          }
          this.data.imageuploadlock = true // 修改上传状态为锁定
          console.log("attachmentimage", this.data.attachmentimage)
          // 异步上传，打印attachment时尚未返回数据
        }
      }
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
        db.collection('INDIVIDUAL').add({
            data: {
              IndividualName: this.data.individualname,
              IndividualPhone: this.data.individualphone,
              IndividualAddress: this.data.individualaddress,
              TaxAccount: this.data.taxaccount,
              TaxPassword: this.data.taxpassword,
              AttachmentImage: this.data.attachmentimage,
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
      db.collection('INDIVIDUAL').doc(this.data.pageParam._id).update({
        data: {
          IndividualName: this.data.individualname,
          IndividualPhone: this.data.individualphone,
          IndividualAddress: this.data.individualaddress,
          TaxAccount: this.data.taxaccount,
          TaxPassword: this.data.taxpassword,
          AttachmentImage: this.data.attachmentimage,
          UpdateDate: new Date().toLocaleDateString()
        },
        success(res) {
          console.log("更新信息成功", res)
          wx.showToast({
            title: '信息修改成功',
            icon: 'success',
            duration: 2000 //持续的时间
          })
        },
        fail(res) {
          console.log("更新信息失败", res)
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
      db.collection('INDIVIDUAL').doc(this.data.pageParam._id).remove({
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
      this.setData({
        pageParam: options,
        image:app.globalData.Gimagearray
      })
      console.log("pageParam", this.data.pageParam._id);
      console.log("pageParam.length", options.length);

      if (options._id) {
        // 从本地存储中读取
        wx.getStorage({
          key: 'LIndividual',
          success: res => {
            this.setData({
              individualarray: res.data
            })
            console.log("individual", this.data.individualarray) //Object {errMsg: "getStorage:ok", data: "value1"}
            // 筛选指定记录
            var fliter = [];
            // var _this = this
            for (var i = 0; i < this.data.individualarray.length; i++) {
              if (this.data.individualarray[i]._id == this.data.pageParam._id) {
                fliter.push(this.data.individualarray[i]);
              }
            }
            console.log(fliter);
            this.setData({
              adddate: fliter[0].AddDate,
              individualname: fliter[0].IndividualName,
              individualphone: fliter[0].IndividualPhone,
              individualaddress: fliter[0].IndividualAddress,
              taxaccount: fliter[0].TaxAccount,
              taxpassword: fliter[0].TaxPassword,
              updatedate: fliter[0].UpdateDate
            })
            for (let i = 0; i < fliter[0].AttachmentImage.length; i++) {
              wx.getImageInfo({
                //把图片地址转换为本地地址
                src: fliter[0].AttachmentImage[i],
                success: (res) => {
                  this.setData({
                    attachmentview:this.data.attachmentview.concat(res.path)
                  })
                  console.log("attachmentview",this.data.attachmentview)
                }
              })
            }
          }
        })
      }

    },
    onShow: function () {

    }
  })