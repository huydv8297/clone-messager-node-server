'use strict'
var fs = require('fs');
const database = require('../Database')
const path = require('path')
const API_KEY = 'dced7270c9e4c55f1de9b395abdf3907'
const axios = require('axios')
const drive = require('googleapis')
const uploadApi = 'https://api.imgbb.com/1/upload?key=' + API_KEY
const driveDownloadUrl = 'https://drive.google.com/uc?id=1HBT7HbI9oyTmvqQL--ImgB5d0Ob_dtVh&export=download'

class UploadController{
    constructor(){}

    getImage(request, respone){
        let imageName = request.params.image
        let imagePath =  path.resolve('uploads/' + imageName)
        console.log(imagePath)
        self.uploadToDrive()
        respone.sendFile(imagePath)
    }


    uploadImage(request, respone){
        let target_path = path.resolve('uploads/' + request.file.filename)
        let extention = request.file.mimetype.replace("image/", "")
        fs.rename(target_path, target_path + "." + extention, error =>{
            if(error)
                respone.send(error)
            else{
                let url = "http://clonemessage.herokuapp.com/upload/" + request.file.filename + '.' + extention

                self.uploadToImageHosting(url, imageUrl =>{
                    console.log(imageUrl)
                    respone.send(imageUrl)
                })
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


    uploadToDrive(){
        var fileMetadata = {
            'name': '8e3799059103eb57d1aa470499345bc9.png'
          };
          var media = {
            mimeType: 'image/png',
            body: fs.createReadStream('../uploads/8e3799059103eb57d1aa470499345bc9.png')
          };
          console.error('uploadToDrive')
          drive.file.create({
            resource: fileMetadata,
            media: media,
            fields: 'id'
          }, function (err, file) {
            if (err) {
              // Handle error
              console.error(err);
            } else {
              console.log('File Id: ', file.id);
            }
          });
    }
}

var self = module.exports = new UploadController()