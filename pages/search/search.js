const app = getApp()
const URL = require('../../common/url_config.js')
Page({
  data: {
    searchValue: '',
    page: 1,
    search_history:[],
    courses: null,
    recommends: [],
    basic_url:URL.BASIC_URL
  },
  onLoad: function() {
    var that = this
    wx.getStorage({
      key: 'searchHistory',
      success: function (res) {
        console.log(res)
        that.setData({
          search_history: res.data
        })
      },
      fail: function (res) {
        wx.setStorage({
          key: "searchHistory",
          data: that.data.search_history
        })
      }
    })
    wx.request({
      url: URL.HOT_URL + app.globalData.token + '/',
      method: 'get',
      success: (res) => {
        this.setData({
          recommends: res.data
        })
      }
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
  },
  clearSearchValue: function() {
    this.setData({
      searchValue: '',
      courses: null
    })
  },
  search: function() {
    var that = this
    wx.request({
      url: URL.LIST_URL + that.data.searchValue +'/'+ that.data.page + '/' + app.globalData.token + '/',
      method: 'get',
      success: (res) => {
        if (res.data.course.length > 0) {
          that.setData({
            courses: res.data.course
          })
        } else {
          that.setData({
            courses: '未找到相关课程'
          })
        }
        var oldHistory = that.data.search_history
        if (oldHistory.indexOf(that.data.searchValue) === -1){
          oldHistory.unshift(that.data.searchValue)
          if (oldHistory.length > 8) {
            console.log(oldHistory.length)
            oldHistory = oldHistory.slice(0, 8)
          }
          that.setData({
            search_history: oldHistory
          })
          wx.setStorage({
            key: "searchHistory",
            data: that.data.search_history
          })
        } 
      }
    })
  },
  historySearch: function(e) {
    console.log(e)
    var that = this
    wx.request({
      url: URL.LIST_URL + e.target.dataset.history + '/' + that.data.page + '/' + app.globalData.token + '/',
      method: 'get',
      success: (res) => {
        if (res.data.course.length > 0) {
          that.setData({
            courses: res.data.course
          })
        } else {
          that.setData({
            courses: '未找到相关课程'
          })
        }
      }
    })
  }
})