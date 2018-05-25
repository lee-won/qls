// pages/list/list.js
const app = getApp()
var URL = require('../../common/url_config.js')
var Fetch = require('../../common/fetch.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    courseType: '',
    totalPage: '',
    courses: [],
    basic_url:URL.BASIC_URL,
    loadFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.type === 'best' ? '精品课程' : options.type === 'hot' ? '热门课程' : '紧缺人才'
    })
    Fetch(URL.MORE_URL + options.type + '/' + this.data.page + '/' + app.globalData.token + '/', 'get',null, (res) => {
      this.setData({
        totalPage: res.pages,
        courses: res.course,
        courseType: options.type
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
  goSearch: function (e) {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  loadMore: function () {
    if (this.data.loadFlag) {
      return
    }
    var that = this
    that.data.page++;
    if (that.data.page <= that.data.totalPage) {
      that.setData({
        loadFlag: true
      })
      setTimeout(() => {
        Fetch(URL.MORE_URL +that.data.courseType + '/' + that.data.page + '/' + app.globalData.token + '/', 'get', null, (res) => {
          this.setData({
            courses: that.data.courses.concat(res.course),
            loadFlag: false
          })
        })
      }, 2000)
    }
  }
})