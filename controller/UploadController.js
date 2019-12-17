'use strict'
var fs = require('fs');
const database = require('../Database')
const path = require('path')
const API_KEY = 'dced7270c9e4c55f1de9b395abdf3907'
const axios = require('axios')
const uploadApi = 'https://api.imgbb.com/1/upload?key=' + API_KEY

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
        let extention = request.file.mimetype.replace("image/", "")
        fs.rename(target_path, target_path + "." + extention, error =>{
            if(error)
                respone.send(error)
            else{
                let url = "http://clonemessage.herokuapp.com/upload/" + request.file.filename + '.' + extention

                let newUrl = self.uploadToImageHosting(url)
                respone.send(newUrl)
            }
                
        })
    }

    uploadToImageHosting(url){
        axios.get(uploadApi + '&image=' + url)
          .then((res) => {
            //let data = JSON.parse(res)
            //let imageUrl = data.data.url
            console.log(res.data.data.url)
            return imageUrl
          })
          .catch((error) => {
            
            console.error(error)
            return {message: false}
          })
        return 
    }
}

var self = module.exports = new UploadController()