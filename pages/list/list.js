// index.js
// 日记聚合页
var app = getApp();
const diaries = require('../../demo/diaries.js');
const login = require('../../services/Login.js')
const config = require("../../config");
const api = require('../../services/API.js')
const pet = require('../../services/Pet.js')
const AVLeanCloud = require('../../utils/av-weapp-min-leancloud.js');
function test(){
  console.log("test")
}

Page({
  data: {
    latitude: 30.196804,
    longitude: 120.233276,
    // 日记列表
    // TODO 从server端拉取
    diaries: null,
    // 是否显示loading
    showLoading: false,
    // loading提示语
    loadingMessage: '',
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var app = getApp()
   // 2.获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        console.log(res)
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
        app.globalData.userInfo.coordinate = {
          latitude:res.latitude,
          longitude:res.longitude
        }

      }
    })

    login.login(
    
    pet.downloadPetData(this,function(that){
    console.log("callback")
    that.getDiaries()
    that.locationFindData(that)
    })
    )
  

    

    
  
  },
  onReady(){
   

  },
 locationFindData(that){
   console.log("haha")
    const app = getApp()
  var query = new AVLeanCloud.Query('Pet')
  var point = new AVLeanCloud.GeoPoint(30, 120)
  query.withinKilometers('coordinate', point, 20.0)
    query.find().then(function (results) {
      that.setUpData(results)
      //this.onLoad
      //重新刷新页面
      that.getDiaries()
      refreshFlag = true
      //this.getLocation
    }, function (error) {
    });

  },
   setUpData(pets) {
     for (var i = 0; i < 3; i++) {
       diaries.diaries[i].meta.title = pets[i].attributes.title
       diaries.diaries[i].meta.cover = pets[i].attributes.petImage.attributes.url
       diaries.diaries[i].meta.nickName = pets[i].attributes.nickName
       diaries.diaries[i].meta.avatar = pets[i].attributes.avatarUrl
     }

     
    
  },
  /**
   * 获取日记列表
   * 目前为本地缓存数据 + 本地假数据
   * TODO 从服务端拉取
   */
  getDiaries() {
    console.log("hehe")
    var that = this;
    app.getDiaryList(list => {
      console.log(list)
      that.setData({diaries: list});
    })
  },

  // 查看详情
  showDetail(event) {
    wx.navigateTo({
      url: '../entry/entry?id=' + event.currentTarget.id,
    });
  }
})
