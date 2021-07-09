const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room1status: "",
    room2status: "",
    room3status: "",
    room4status: "",
    room1color: "",
    room2color: "",
    room3color: "",
    room4color: "",
    enterpassword1: "",
    enterpassword2: "",
    enterpassword3: "",
    enterpassword4: "",
    cleanpassword1: "",
    cleanpassword2: "",
    cleanpassword3: "",
    cleanpassword4: "",
    room1enterpassword: "",
    room2enterpassword: "",
    room3enterpassword: "",
    room4enterpassword: "",
    room1cleanpassword: "",
    room2cleanpassword: "",
    room3cleanpassword: "",
    room4cleanpassword: "",
    // 轮播参数
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
  EnterPassword1(e) {
    this.setData({
      enterpassword1: e.detail.value
    })
  },
  EnterPassword2(e) {
    this.setData({
      enterpassword2: e.detail.value
    })
  },
  EnterPassword3(e) {
    this.setData({
      enterpassword3: e.detail.value
    })
  },
  EnterPassword4(e) {
    this.setData({
      enterpassword4: e.detail.value
    })
  },
  CleanPassword1(e) {
    this.setData({
      cleanpassword1: e.detail.value
    })
  },
  CleanPassword2(e) {
    this.setData({
      cleanpassword2: e.detail.value
    })
  },
  CleanPassword3(e) {
    this.setData({
      cleanpassword3: e.detail.value
    })
  },
  CleanPassword4(e) {
    this.setData({
      cleanpassword4: e.detail.value
    })
  },
  Room1login() {
    if (this.data.room1status == "使用中") {
      if (this.data.enterpassword1 == this.data.room1enterpassword) {
        wx.navigateTo({
          url: '../meetingroom/meetingroom1',
        })
      } else {
        wx.showToast({
          title: '密码不正确',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      }
    } else {
      if (this.data.enterpassword1 == "" || this.data.cleanpassword1 == "") {
        wx.showToast({
          title: '需输入两个密码',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      } else {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'MeetingRoomSetting',
          data: {
            key1: "Room1EnterPassword",
            value1: this.data.enterpassword1,
            key2: "Room1CleanPassword",
            value2: this.data.cleanpassword1,
          },
          success: res => {
            wx.navigateTo({
              url: '../meetingroom/meetingroom1',
            })
          }
        })
      }
    }
  },
  Room1Clean() {
    if (this.data.cleanpassword1 == this.data.room1cleanpassword) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'MeetingRoomClean',
        data: {
          collection: "MeetingRoom1"
        },
        success: res => {
          wx.cloud.callFunction({
            name: 'MeetingRoomSetting',
            data: {
              key1: "Room1EnterPassword",
              key2: "Room1CleanPassword",
              value1: "",
              value2: "",
            },
            success: res => {
              wx.showToast({
                title: '内容清除成功',
                icon: 'success',
                duration: 2000 //持续的时间
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '密码不正确',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    }

  },
  Room2Clean() {
    if (this.data.cleanpassword2 == this.data.room2cleanpassword) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'MeetingRoomClean',
        data: {
          collection: "MeetingRoom1"
        },
        success: res => {
          wx.cloud.callFunction({
            name: 'MeetingRoomSetting',
            data: {
              key1: "Room2EnterPassword",
              key2: "Room2CleanPassword",
              value1: "",
              value2: "",
            },
            success: res => {
              wx.showToast({
                title: '内容清除成功',
                icon: 'success',
                duration: 2000 //持续的时间
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '密码不正确',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    }

  },
  Room3Clean() {
    if (this.data.cleanpassword3 == this.data.room3cleanpassword) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'MeetingRoomClean',
        data: {
          collection: "MeetingRoom1"
        },
        success: res => {
          wx.cloud.callFunction({
            name: 'MeetingRoomSetting',
            data: {
              key1: "Room3EnterPassword",
              key2: "Room3CleanPassword",
              value1: "",
              value2: "",
            },
            success: res => {
              wx.showToast({
                title: '内容清除成功',
                icon: 'success',
                duration: 2000 //持续的时间
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '密码不正确',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    }

  },
  Room4Clean() {
    if (this.data.cleanpassword4 == this.data.room4cleanpassword) {
      // 调用云函数
      wx.cloud.callFunction({
        name: 'MeetingRoomClean',
        data: {
          collection: "MeetingRoom4"
        },
        success: res => {
          wx.cloud.callFunction({
            name: 'MeetingRoomSetting',
            data: {
              key1: "Room4EnterPassword",
              key2: "Room4CleanPassword",
              value1: "",
              value2: "",
            },
            success: res => {
              wx.showToast({
                title: '内容清除成功',
                icon: 'success',
                duration: 2000 //持续的时间
              })
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '密码不正确',
        icon: 'error',
        duration: 2000 //持续的时间
      })
    }

  },
  Room2login() {
    if (this.data.room2status == "使用中") {
      if (this.data.enterpassword2 == this.data.room2enterpassword) {
        wx.navigateTo({
          url: '../meetingroom/meetingroom2',
        })
      } else {
        wx.showToast({
          title: '密码不正确',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      }
    } else {
      if (this.data.enterpassword2 == "" || this.data.cleanpassword2 == "") {
        wx.showToast({
          title: '需输入两个密码',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      } else {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'MeetingRoomSetting',
          data: {
            key1: "Room2EnterPassword",
            value1: this.data.enterpassword2,
            key2: "Room2CleanPassword",
            value2: this.data.cleanpassword2,
          },
          success: res => {
            wx.navigateTo({
              url: '../meetingroom/meetingroom2',
            })
          }
        })
      }
    }
  },
  Room3login() {
    if (this.data.room3status == "使用中") {
      if (this.data.enterpassword3 == this.data.room3enterpassword) {
        wx.navigateTo({
          url: '../meetingroom/meetingroom3',
        })
      } else {
        wx.showToast({
          title: '密码不正确',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      }
    } else {
      if (this.data.enterpassword3 == "" || this.data.cleanpassword3 == "") {
        wx.showToast({
          title: '需输入两个密码',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      } else {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'MeetingRoomSetting',
          data: {
            key1: "Room3EnterPassword",
            value1: this.data.enterpassword3,
            key2: "Room3CleanPassword",
            value2: this.data.cleanpassword3,
          },
          success: res => {
            wx.navigateTo({
              url: '../meetingroom/meetingroom3',
            })
          }
        })
      }
    }
  },
  Room4login() {
    if (this.data.room4status == "使用中") {
      if (this.data.enterpassword4 == this.data.room4enterpassword) {
        wx.navigateTo({
          url: '../meetingroom/meetingroom4',
        })
      } else {
        wx.showToast({
          title: '密码不正确',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      }
    } else {
      if (this.data.enterpassword4 == "" || this.data.cleanpassword4 == "") {
        wx.showToast({
          title: '需输入两个密码',
          icon: 'error',
          duration: 2000 //持续的时间
        })
      } else {
        // 调用云函数
        wx.cloud.callFunction({
          name: 'MeetingRoomSetting',
          data: {
            key1: "Room4EnterPassword",
            value1: this.data.enterpassword4,
            key2: "Room4CleanPassword",
            value2: this.data.cleanpassword4,
          },
          success: res => {
            wx.navigateTo({
              url: '../meetingroom/meetingroom4',
            })
          }
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      image: app.globalData.Gimagearray
    })

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
    let that = this
    const db = wx.cloud.database()
    db.collection('MeetingRoom1').get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            room1color: "red",
            room1status: "使用中"
          })
        } else {
          this.setData({
            room1color: "green",
            room1status: "未使用"
          })
        }
      }
    })
    db.collection('MeetingRoom2').get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            room2color: "red",
            room2status: "使用中"
          })
        } else {
          this.setData({
            room2color: "green",
            room2status: "未使用"
          })
        }
      }
    })
    db.collection('MeetingRoom3').get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            room3color: "red",
            room3status: "使用中"
          })
        } else {
          this.setData({
            room3color: "green",
            room3status: "未使用"
          })
        }
      }
    })
    db.collection('MeetingRoom4').get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            room4color: "red",
            room4status: "使用中"
          })
        } else {
          this.setData({
            room4color: "green",
            room4status: "未使用"
          })
        }
      }
    })

    db.collection('setting').get({
      success(res) {
        that.setData({
          room1enterpassword: res.data[0].Room1EnterPassword,
          room2enterpassword: res.data[0].Room2EnterPassword,
          room3enterpassword: res.data[0].Room3EnterPassword,
          room4enterpassword: res.data[0].Room4EnterPassword,
          room1cleanpassword: res.data[0].Room1CleanPassword,
          room2cleanpassword: res.data[0].Room2CleanPassword,
          room3cleanpassword: res.data[0].Room3CleanPassword,
          room4cleanpassword: res.data[0].Room4CleanPassword,
        })

      }
    })
    console.log(this.data.room1enterpassword)
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