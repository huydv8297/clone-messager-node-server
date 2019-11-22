'use strict'
var fs = require('fs');
const database = require('../Database')

class UploadController{
    constructor(){}

    getImage(request, respone){
        let imageName = request.params.image
        respone.send()
    }


    uploadImage(request, respone){
        console.log(request);

        var tmp_path = request.files.path;
    
        var target_path = 'uploads/' + request.files.originalname;
    
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function() { respone.send("ok"); });
        src.on('error', function(err) { respone.send({error: "upload failed"}); });
    }
}

var self = module.exports = new UploadController()