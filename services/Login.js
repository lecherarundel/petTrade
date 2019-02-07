
const AVLeanCloud = require('../utils/av-weapp-min-leancloud.js');
const api = require('../services/API.js')
var app = getApp()
function loginHelper(){
  // 存储用户信息到本地
  wx.setStorage({
    key: 'userInfo',
    data: {
      userInfo: {
        avatarUrl: res.userInfo.avatarUrl,
        nickName: res.userInfo.nickName,
        gender: sex,
        meta: res.userInfo.signature
      },
      bType: "warn",
      actionText: "退出登录"
    },
    success: function (res) {
      console.log("存储成功")
    }
  })
}
function login(fn){
 
  wx.login({
    success: (res) => {

   
      wx.hideLoading();
      wx.getUserInfo({
        withCredentials: false,
        success: (res) => {
        
          AVLeanCloud.User.loginWithWeapp().then(user => {  
             setData(res,user,fn)
          
        }
          )
        }, fail: function (error) { console.log(error) }
      })
    }})

  //回调函数
  
  }
    
function setData(res,user,fn)
{
  var app = getApp()
  app.globalData.userInfo.username = user.attributes.username
  console.log(app.globalData.userInfo.username)
  //save in leanCloud
  user.set(res.userInfo).save().then(user => {
    // 成功，此时可在控制台中看到更新后的用户信息
    //this.globalData.user = user.toJSON();
  }).catch(console.error);
  setDataHelper(res,user,fn)
}
function setDataHelper(res,user,fn){
  var app = getApp()
  if (res.userInfo.gender) {
    var sex = "♂"
  }
  else {
    var sex = "♀"
  }
  console.log("设置昵称和图片")
  app.globalData.userInfo.avatarUrl = res.userInfo.avatarUrl, app.globalData.userInfo.nickName = res.userInfo.nickName,
    app.globalData.userInfo.gender = sex,
    app.globalData.userInfo.meta = res.userInfo.signature
    console.log(app.globalData.userInfo)
  fn()
}
module.exports.login = login