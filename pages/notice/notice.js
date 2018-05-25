// pages/notice/notice.js
const app = getApp()
var URL = require('../../common/url_config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: URL.NOTICE_URL + app.globalData.token + '/',
      method: 'get',
      success: function (res) {
        that.setData({
          files: res.data.data.files
        })
      }
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
  
  },
  download: function(e) {
    wx.downloadFile({
      url: URL.BASIC_URL + e.currentTarget.dataset.url, //仅为示例，并非真实的资源
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          fileType: e.currentTarget.dataset.type,
          success: function (res) {
            console.log('打开文档成功')
          },
          fail: function(res) {
            console.log('打开文档失败')
          }
        })
      }
    })
  }
})