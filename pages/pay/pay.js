// pages/pay/pay.js
const app = getApp()
const URL = require('../../common/url_config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    price: '',
    course_id: '',
    level: [],
    totalPay: '',
    buyType: '',
    personNum: 1,
    company:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      name: options.name,
      price: options.price,
      level: options.level,
      buyType: options.buyType,
      course_id: options.id,
      totalPay: options.price
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
  add: function() {
    this.setData({
      personNum: parseInt(this.data.personNum) + 1,
      totalPay: parseInt(this.data.price) * (parseInt(this.data.personNum) + 1)
    })
  },
  decrease: function() {
    if (this.data.personNum > 1) {
      this.setData({
        personNum: parseInt(this.data.personNum) - 1,
        totalPay: parseInt(this.data.price) * (parseInt(this.data.personNum) - 1)
      })
    }
  },
  bindCompanyInput: function(e) {
    this.setData({
      company: e.detail.value
    })
  },
  bindNumInput: function (e) {
    this.setData({
      personNum: e.detail.value ? e.detail.value : 1,
      totalPay: parseInt(this.data.price) * parseInt(e.detail.value ? e.detail.value : 1)
    })
  },
  buy: function() {
    if (this.data.buyType === 'company' && this.data.company === '') {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '请稍后'
    })
    var that = this
    wx.login({
      success: (res) => {
        wx.request({
          url: URL.BUY_URL + that.data.course_id + '/' + that.data.level + '/' + res.code + '/' + app.globalData.token + '/',
          method: 'post',
          data: {
            company: that.data.company,
            member: that.data.personNum
          },
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
                  setTimeout(() => {
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
  }
})