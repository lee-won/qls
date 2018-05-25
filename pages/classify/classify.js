// pages/classify/classify.js
const app = getApp()
var URL = require('../../common/url_config.js')
var Fetch = require('../../common/fetch.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    basic_url: URL.BASIC_URL,
    data: [],
    type: 'classify0'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    Fetch(URL.ALL_URL + app.globalData.token, 'get', null, (res) => {
      this.setData({
        data: res.data
      })
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
  setCurrent: function(e) {
    this.setData({
      type: e.currentTarget.dataset.type
    })
  }
})