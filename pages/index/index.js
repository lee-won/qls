//index.js
const app = getApp()
var URL = require('../../common/url_config.js')
var Fetch = require('../../common/fetch.js')
Page({
  data: {
    best: [],
    hot: [],
    lack: [],
    images: [],
    basic_url: URL.BASIC_URL,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onPullDownRefresh: function () {
    // wx.startPullDownRefresh()
    // wx.stopPullDownRefresh()
  },
  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    setTimeout(()=>{
      // 获取首页信
      var that = this
      Fetch(URL.INDEX_URL + app.globalData.token + '/', 'get', null, (res) => {
        this.setData({
          best: res.data.best,
          hot: res.data.hot,
          lack: res.data.lack,
          images:res.data.indexImages
        })
      })
    }, 2000)
  },
  getUserInfo: function (e) {
    console.log(e)
    if (e.detail.userInfo) {
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
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
  },
  changeCourse: function() {
    var that = this
    that.data.page++;
    wx.request({
      url: URL.LIST_URL + that.data.page + '/' + app.globalData.token + '/',
      method: 'get',
      success: function (res) {
        that.setData({
          lists: res.data.course,
          images: res.data.indexImages
        })
      }
    })
  }
})
