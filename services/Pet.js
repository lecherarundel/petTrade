const app = getApp()
const diaries = require('../demo/diaries.js');
const AVLeanCloud = require('../utils/av-weapp-min-leancloud.js');

function setUpData(pets,users){
  diaries.diaries[0].meta.title = pets[0].attributes.title
  diaries.diaries[0].meta.cover = pets[0].attributes.petImage.attributes.url
  diaries.diaries[0].meta.nickName = users[0].attributes.nickName
  diaries.diaries[0].meta.avatar = users[0].attributes.avatarUrl 

}
function downloadPetData(that,fn) {
  var query = new AVLeanCloud.Query('Pet');
  var point = new AVLeanCloud.GeoPoint(30, 120)
  query.withinKilometers('coordinate', point, 20.0);
  query.find().then(function (results) {

    for (let result of results) {
      console(result)
    }
    //this.onLoad
    refreshFlag = true
    //this.getLocation
  }, function (error) {

  });
  const app = getApp()
  var queryPet = new AVLeanCloud.Query('Pet');
  var queryUser = new AVLeanCloud.Query('_User');
  console.log("搜索用户名: "+app.globalData.userInfo.username)
  queryPet.startsWith('username', app.globalData.userInfo.username);
  queryUser.startsWith('username', app.globalData.userInfo.username);
  queryPet.find().then(function (pets) {
    queryUser.find().then(function(users){
      console.log(pets)
      console.log(diaries.diaries)
      console.log(users)
      //输入数据到本地,替换原有本地假数据
      setUpData(pets,users)   
      fn(that)

    },function (error) {
      console.log(error)
    });
   
    
  }, function(error) {
    console.log(error)
  });
}
function uploadPetData(petData) {
  console.log(petData)
  const app = getApp()
  // 声明类型
  var Pet = AVLeanCloud.Object.extend('Pet');
  // 新建对象
  var pet = new Pet();
    // 修改属性
    pet.set('title', petData.title);
    pet.set('age', petData.age);
    pet.set('kind', petData.kind);
    pet.set('description', petData.description);
    pet.set('price', petData.price)
    pet.set('phoneNumber', petData.phoneNumber)
    pet.set('username',petData.username)
    pet.set('nickName', app.globalData.userInfo.nickName)
    pet.set('avatarUrl', app.globalData.userInfo.avatarUrl)
    console.log(app.globalData.userInfo.coordinate.latitude)
  var latitude = app.globalData.userInfo.coordinate.latitude
  var longitude = app.globalData.userInfo.coordinate.longitude
    var coordinate = new AVLeanCloud.GeoPoint(latitude,longitude)
    pet.set('coordinate',coordinate)

    console.log(petData.petImage)
    var tempFilePath = petData.petImage
    var file = new AVLeanCloud.File(petData.title, {
      blob: {
        uri: tempFilePath,
      },
    })
    pet.set('petImage', file)
    console.log(pet)
    pet.save().then(), function (error) {
      console.log(error);
    }, function (error) {
    console.log(error)
  };
}
module.exports.uploadPetData = uploadPetData
module.exports.downloadPetData = downloadPetData
