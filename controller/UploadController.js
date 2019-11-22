'use strict'
var fs = require('fs');
const database = require('../Database')
const path = require('path')

class UploadController{
    constructor(){}

    getImage(request, respone){
        let imageName = request.params.image
        let imagePath =  path.resolve('uploads/' + imageName)
        console.log(imagePath)
        respone.sendFile(imagePath)
    }


    uploadImage(request, respone){
        let target_path = 'uploads/' + request.file.filename
        let extention = request.file.mimetype
        fs.rename(target_path, target_path + "." + extention.replace("image/", ""), error =>{
            if(error)
                respone.send(error)
            else
                respone.send("http://clonemessage.herokuapp.com/upload/" + request.file.filename + '.png')
        })
    }
}

var self = module.exports = new UploadController()