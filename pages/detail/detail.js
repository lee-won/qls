const app = getApp()
var URL = require('../../common/url_config.js')
Page({
  data: {
    id: '',
    desc: null,
    modalFlag: false,
    phoneNum: '',
    code: ''
  },
  onLoad: function(options) {
    var that = this
    wx.request({
      url: URL.DETAIL_URL + options.id + '/' + app.globalData.token +'/',
      method: 'POST',
      success: function(res) {
        that.setData({
          id: options.id,
          desc: res.data.course
        })
      }
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShow: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '这是详情页标题',
      path: '/pages/detail/detail?id=' + that.data.id,
      success: function (res) {
        if (res.shareTickets) {
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success(res) {
              var data = res
              wx.login({
                success: (res) => {
                  wx.request({
                    url: 'http://192.168.50.106:8000/api/article/miniapp/share/',
                    method: 'post',
                    data:{
                      code: res.code,
                      encryptedData: data.encryptedData,
                      iv: data.iv
                    },
                    success: (res) => {
                      console.log(res)
                    }
                  })
                }
              })
            }
          })
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  buy: function() {
    this.setData({
      modalFlag: !app.globalData.phone
    })
   // if (app.globalData.phone) {
      wx.login({
        success: (res) => {
          wx.request({
            url:URL.BUY_URL + '2/' + res.code + '/'+app.globalData.token + '/',
            method: 'post',
            success: function (res) {
              //if (res.code === 0) {
                console.log(res)
                wx.requestPayment({
                  'timeStamp': res.data.timeStamp,
                  'nonceStr': res.data.nonceStr,
                  'package': res.data.package,
                  'signType': res.data.signType,
                  'paySign': res.data.paySign,
                  'success': function (res) {
                    console.log(res)
                  },
                  'fail': function (res) {
                    console.log(res)
                  }
                })
              //}
            }
          })
        }
      })
     
   // }else{

  //  }
  },
  closeModal () {
    this.setData({
      modalFlag: false
    })
  },
  bindKeyInput1: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  bindKeyInput2: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode () {
    wx.request({
      url: URL.SEND_MESSAGE_URL + this.data.phoneNum + '/' + app.globalData.token + '/' ,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '验证码已发送到您的手机，请注意查收',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  sendData () {
    wx.request({
      url: URL.SAVE_PHONE_URL + this.data.phoneNum + '/'+ this.data.code + '/' + app.globalData.token + '/',
      method: 'GET',
      success: (res) => {
        console.log(res)
      }
    })
  }
})