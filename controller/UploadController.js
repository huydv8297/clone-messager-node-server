'use strict'
var fs = require('fs');
const database = require('../Database')
const path = require('path')
const API_KEY = 'dced7270c9e4c55f1de9b395abdf3907'
const axios = require('axios')
const uploadApi = 'https://api.imgbb.com/1/upload?key=' + API_KEY

var {google} = require("googleapis")
var drive = google.drive("v3")
var key = require("../private_key.json")
var folderId = '1kmPoLdvF5EEmeQoYSH4n0nvojly8pXLy'


/***** make the request to retrieve an authorization allowing to works
      with the Google drive web service *****/
// retrieve a JWT
var jwToken = new google.auth.JWT(
  key.client_email,
  null,
  key.private_key, ["https://www.googleapis.com/auth/drive"],
  null
)

jwToken.authorize((authErr) => {
  if (authErr) {
    console.log("error : " + authErr)
    return
  } else {
    console.log("Authorization accorded")
  }
})


class UploadController{
    constructor(){}

    getImage(request, respone){
        let imageName = request.params.image
        let imagePath =  path.resolve('uploads/' + imageName)
        console.log(imagePath)
        
        respone.sendFile(imagePath)
    }


    uploadImage(request, respone){
        let target_path = path.resolve('uploads/' + request.file.filename)
        let extention = ''
        if(request.file.mimetype.includes("image")){
          extention = request.file.mimetype.replace("image/", "")
        }

        if(request.file.mimetype.includes("video")){
          extention = request.file.mimetype.replace("video/", "")
        }

        fs.rename(target_path, target_path + "." + extention, error =>{
            if(error)
                respone.send(error)
            else{
                // let url = "http://clonemessage.herokuapp.com/upload/" + request.file.filename + '.' + extention
                
                // self.uploadToImageHosting(url, imageUrl =>{
                //     console.log(imageUrl)
                //     respone.send(imageUrl)
                // })
                let fileName = request.file.filename + '.' + extention
                let filePath = target_path + '.' + extention
                console.log('Filename: ' + fileName)
                console.log('Filepath: ' + filePath)
                self.uploadToDrive(fileName, filePath, request.file.mimetype, respone)
            }
        })
    }

    uploadToImageHosting(url, callback){
        axios.get(uploadApi + '&image=' + url)
          .then((res) => {
            //let data = JSON.parse(res)
            let imageUrl = res.data.data.url
            callback(imageUrl) 
          })
          .catch((error) => {
            console.error(error)
            callback({message: false}) 
          })
    }


    uploadToDrive(fileName, filepath, mimeType, respone){
      var fileMetadata = {
        'name': fileName,
        parents: [folderId]
      };
      var media = {
        mimeType: mimeType,
        body: fs.createReadStream(filepath)
      }
      console.log(fs.existsSync(filepath))
      drive.files.create({
        auth: jwToken,
        resource: fileMetadata,
        media: media,
        fields: 'id'
      }, function(err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          
          const driveDownloadUrl = 'https://drive.google.com/uc?id=' + file.data.id
          console.log('File Id: ', file.data.id)
          console.log('File URL: ', driveDownloadUrl)
          respone.send(driveDownloadUrl)
        }
      });
    }
}

var self = module.exports = new UploadController()