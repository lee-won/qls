const app = getApp()
const URL = require('../../common/url_config.js')
var course_id = ''
Page({
  data: {
    id: '',
    desc: null,
    selectLevel: '',
    payFlag: false,
    modalFlag: false,
    phoneNum: '',
    code: '',
    codeBtnText: '获取验证码',
    codeValue: '',
    basic_url:URL.BASIC_URL
  },
  onLoad: function(options) {
    course_id = options.id
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
                    url: URL.SHARE_URL + app.globalData.token + '/',
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
    if (this.data.desc.level.length > 0 && this.data.selectLevel === '') {
      wx.showToast({
        title: '请选择课程等级',
        icon: 'none'
      })
      return
    } else if (this.data.selectLevel === ''){
      this.setData({
        selectLevel: 'empty'
      })
    } 
    this.setData({
      modalFlag: !app.globalData.phone
    })
    var that = this
    wx.showLoading({
      title: '请稍后'
    })
   if (app.globalData.phone) {
      wx.login({
        success: (res) => {
          wx.request({
            url:URL.BUY_URL + course_id + '/' + that.data.selectLevel+ '/' + res.code + '/'+app.globalData.token + '/',
            method: 'post',
            success: function (res) {
              wx.hideLoading()
              if (res.data.code === 0) {
                wx.requestPayment({
                  'timeStamp': res.data.data.timeStamp,
                  'nonceStr': res.data.data.nonceStr,
                  'package': res.data.data.package,
                  'signType': res.data.data.signType,
                  'paySign': res.data.data.paySign,
                  'success': function (res) {
                    wx.showToast({
                      title: '购买成功',
                      icon: 'success'
                    })
                    setTimeout(() =>{
                      wx.switchTab({
                        url: '/pages/order/order'
                      })
                    }, 2000) 
                  },
                  'fail': function (res) {
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none'
                })
              }
            }
          })
        }
      })
   }else{
     return
   }
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
    if (this.data.phoneNum) {
      var reg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!reg.test(this.data.phoneNum)) {
        wx.showToast({
          title: '手机号不合法',
          icon: 'none'
        })
        return
      }
    } else {
      wx.showToast({
        title: '请先输入手机号',
        icon: 'none'
      })
      return
    }
    if (this.data.codeBtnText === '获取验证码' || '重新发送') {
      wx.request({
        url: URL.SEND_MESSAGE_URL + this.data.phoneNum + '/' + app.globalData.token + '/',
        method: 'GET',
        success: (res) => {
          if (res.data.code === 0) {
            wx.showToast({
              title: '验证码已发送到您的手机，请注意查收',
              duration: 2000,
              icon: 'none'
            })
            this.setData({
              codeValue: res.data.message.toString()
            })
          }
        }
      })
      var TIME = 60
        var Timer = setInterval(() => {
          this.setData({
            codeBtnText: TIME + '秒'
          })
          TIME--
          if (TIME < 0) {
            clearInterval(Timer)
            this.setData({
              codeBtnText: '重新发送'
            })
          }
        }, 1000)
    } else {
      return
    }
  },
  sendData () {
    if (this.data.codeValue !== this.data.code) {
      console.log(this.data.codeValue + '----' +this.data.code)
      wx.showToast({
        title: '验证码不正确',
      })
      return
    }
    if (this.data.phoneNum) {
      var reg = /^1[3|4|5|7|8][0-9]{9}$/
      if (!reg.test(this.data.phoneNum)) {
        wx.showToast({
          title: '手机号不合法',
          icon: 'none'
        })
        return
      }
    } else {
      wx.showToast({
        title: '请先输入手机号',
        icon: 'none'
      })
      return
    }
    wx.request({
      url: URL.SAVE_PHONE_URL + this.data.phoneNum + '/'+ this.data.code + '/' + app.globalData.token + '/',
      method: 'GET',
      success: (res) => {
        app.globalData.phone = this.data.phoneNum
        this.setData({
          modalFlag: false
        })
      }
    })
  },
  downfile: function(e) {
    var that = this
    wx.downloadFile({
      url: e.currentTarget.dataset.url,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: that.data.desc.doc_type,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function (res) {
            console.log('打开文档失败')
          }
        })
      }
    })
  },
  setLevel: function(e) {
    this.setData({
      selectLevel: e.currentTarget.dataset.level
    })
  }
})