// pages/index/calculate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    num1:"",
    
    num2:"",
    
    result:"",
    zenzhishui:"",
    fujiashui:"",
    geshui:"",
    shuikuanheji:""
    
    },
    
    getNum1:function(e){
    
    var n=e.detail.value;
    
    if(!isNaN(n)){
    
    this.setData({
    
    num1:n
    
    });
    
    }
    
    },
    
    getNum2:function(e){
    
    var n=e.detail.value;
    
    if(!isNaN(n)){
    
    this.setData({
    
    num2:n
    
    });
    
    }
    
    },
  
    add:function(e){
    
    var n=this.data.num1*1+this.data.num2*1;
  var zenzhishui=this.data.num1/1.01*0.01;

    this.setData({
    
    result:n

    });
    
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