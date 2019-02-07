// post.js
//var Bmob = require('../../utils/bmob.js');
var util = require('../../utils/util.js')
const api = require('../../services/API.js')

var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //导航栏的数据
    nickName:app.globalData.userInfo.nickName,
    avatarUrl:app.globalData.userInfo.avatarUrl,
    username:app.globalData.userInfo.username,
    postPet: true,
    postThing: false,
    postJob: false,
    petImgFile:{},
    //发布宠物的data值
    userPhoneNumber: '', //用户电话号码
    studentId: '', //用户id 10
    nickname: '', //用户昵称 11
    ownerGender: '', //用户性别，0女 1男
    bookFound: false, //
    petId: '', //宠物id 
    petImg: '', //宠物图片链接9 物品图片链接
    currentPrice: '', //售价7 物品价格
    postRemark: '', // 备注8
    buttonLoading: false,
    petTitle:'',
    petKind:'',
    petAge:'',
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var studentId = that.data.studentId;
    var nickName = that.data.nickName;
    wx.getStorage({
      key: 'studentId',
      success: function(res) {
        that.setData({
          studentId: res.data
        })
      },
    })
    wx.getStorage({
      key: 'nickName',
      success: function(res) {
        that.setData({
          nickName: res.data
        })
      },
    })
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.setNavigationBarTitle({
      title: '宠物交易'
    });
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标
    setTimeout(function () {
      wx.stopPullDownRefresh(); //停止加载
      wx.hideNavigationBarLoading(); //隐藏加载icon
    }, 2000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //导航栏的响应事件
  choosePostPet: function(e) {
    var that = this;
    that.setData({
      postPet: true,
    })
  },



  //响应事件

  //书本信息
  bindUserPhoneNumberInput: function(e) {
    this.setData({
      userPhoneNumber: e.detail.value
    })
  },
  bindPetTitleInput: function(e) {
    this.setData({
      petTitle: e.detail.value
    })
  },
  bindPetKindInput: function(e) {
    this.setData({
      petKind: e.detail.value
    })
  },
  bindPetAgeInput: function(e) {
    this.setData({
      petAge: e.detail.value
    })
  },

  bindCurrentPriceInput: function(e) {
    this.setData({
      currentPrice: e.detail.value
    })
  },

  bindPostRemarkInput: function(e) {
    this.setData({
      postRemark: e.detail.value
    })
  },
  bindPetImageInput: function() {
    var that = this;
    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: function(res) {
        console.log(res)
        that.setData({
          petImg: res.tempFilePaths[0]
          
        })
      },

    })
  },
  bindSubmitBook: function() {
    var app = getApp()
    console.log(app)
    
    var that = this;
    var studentId = that.data.studentId;
      that.setData({
        buttonLoading: true,
        username:app.globalData.userInfo.username,
        avatarUrl:app.globalData.userInfo.avatarUrl
      })
    console.log(app.globalData.userInfo.username)
      //console.log(that.data.petImgFile)
    var petData = {
      title: that.data.petTitle,
      kind:that.data.petKind,
      age:that.data.petAge,
      price:that.data.currentPrice,
      description:that.data.postRemark,
      phoneNumber:that.data.userPhoneNumber,
      petImage: that.data.petImg,
      username: that.data.username,
      nickName: that.data.nickName,
      avatarUrl:that.data.avatarUrl
    }
    api.uploadData(petData)

  },

})