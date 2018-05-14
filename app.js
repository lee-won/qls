//app.js
var URL = require('./common/url_config.js')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              var userData = res
              wx.login({
                success: (res) => {
                  wx.request({
                    url: URL.LOGIN_URL,
                    method: 'post',
                    data: {
                      code: res.code,
                      encryptedData: userData.encryptedData,
                      iv: userData.iv
                    },
                    success: (res) => {
                      this.globalData.token = res.data.token
                      this.globalData.phone = res.data.phone
                    }
                  })
                }
              })

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    // 获取授权并登录
    /*
    wx.getSetting({
      success: (res) => {
        if(!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: (res) => {
              wx.getUserInfo({
                success: (res) => {
                  this.globalData.userInfo = res.userInfo
                  var userData = res
                  wx.login({
                    success: (res) => {
                      console.log(this)
                      wx.request({
                        url: URL.LOGIN_URL,
                        method: 'post',
                        data:{
                          code: res.code,
                          encryptedData:userData.encryptedData,
                          iv: userData.iv
                        },
                        success: (res) => {
                          this.globalData.token = res.data.token
                          this.globalData.phone = res.data.phone
                        }
                      })
                    }
                  })
                }
              })
            },
            fail: (res) => {
              wx.showModal({
                title: '提示',
                content: '部分功能将受限',
                success: (res) => {
                  if(res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if(res.authSetting['scope.userInfo']) {
                          wx.reLaunch({
                            url: '/pages/index/index'
                          })
                        }else{
                          wx.navigateBack({
                            delta: -1
                          })
                        }
                      }
                    })
                  }else{
                    wx.navigateBack({
                      delta: -1
                    })
                  }
                }
              })
            }
          })
        } else {
          wx.getUserInfo({
            success: (res) => {
              this.globalData.userInfo = res.userInfo
              var userData = res
              wx.login({
                success: (res) => {
                  wx.request({
                    url: URL.LOGIN_URL,
                    method: 'post',
                    data: {
                      code: res.code,
                      encryptedData: userData.encryptedData,
                      iv: userData.iv
                    },
                    success: (res) => {
                      this.globalData.token = res.data.token
                      this.globalData.phone = res.data.phone
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
    */
  },
  globalData: {
    userInfo: null,
    token: '',
    phone: ''
  }
})