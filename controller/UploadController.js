'use strict'
var fs = require('fs');
const database = require('../Database')
const path = require('path');

class UploadController{
    constructor(){}

    getImage(request, respone){
        let imageName = request.params.image
        let imagePath =  path.resolve('uploads/' + imageName)
        console.log(imagePath)
        respone.sendFile(imagePath)
    }


    uploadImage(request, respone){

        var tmp_path = request.file.path;
    
        var target_path = 'uploads/' + request.file.originalname;
    
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function() { respone.send(target_path); });
        src.on('error', function(err) { respone.send({error: "upload failed"}); });
    }
}

var self = module.exports = new UploadController()