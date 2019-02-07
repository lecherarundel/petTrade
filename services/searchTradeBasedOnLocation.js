const app = getApp()
const diaries = require('../demo/diaries.js');
const AVLeanCloud = require('../utils/av-weapp-min-leancloud.js');
function setUpData(pets, users) {
  diaries.diaries[0].meta.title = pets[0].attributes.title
  diaries.diaries[0].meta.cover = pets[0].attributes.petImage.attributes.url
  diaries.diaries[0].meta.nickName = users[0].attributes.nickName
  diaries.diaries[0].meta.avatar = users[0].attributes.avatarUrl

}
function locationFindData(){
  const app = getApp()
  var query = new AVLeanCloud.Query('Pet')
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
 
}
function parseUsername(result){
  var username = result.attributes.username
  var queryUser = new AVLeanCloud.Query('_User');
  queryUser.startsWith('username', username);
  queryUser.find().then(function (users) {
    console.log(pets)
    console.log(diaries.diaries)
    console.log(users)
    //输入数据到本地,替换原有本地假数据
    setUpData(pets, users)
    fn(that)

  }, function (error) {
    console.log(error)
  });

}
module.exports.locationFindData = locationFindData
