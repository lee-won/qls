//index.js
const app = getApp()
var URL = require('../../common/url_config.js')
Page({
  data: {
    lists: [],
    basic_url: URL.BASIC_URL,
    page: 1
  },
  onPullDownRefresh: function () {
    // wx.startPullDownRefresh()
    // wx.stopPullDownRefresh()
  },
  onLoad: function() {
    var that = this
    setTimeout(() => {
      wx.request({
        url: URL.LIST_URL + that.data.page + '/' + app.globalData.token + '/',
        method: 'get',
        success: function (res) {
          that.setData({
            lists: res.data.course
          })
        }
      })
    },2000)
   
  },
  //事件处理函数
  bindViewTap: function(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    })
  },
  goSearch: function(e) {
    wx.navigateTo({
      url: '../search/search'
    })
  }
})
