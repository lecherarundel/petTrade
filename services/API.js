
const Pet = require('../services/Pet.js')
function downloadData(fn){
   Pet.downloadPetData()
   fn()
}
//上传数据
function uploadData(Data){
 
  Pet.uploadPetData(Data)
}
module.exports.uploadData = uploadData
module.exports.downloadData = downloadData
 