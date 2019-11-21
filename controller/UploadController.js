'use strict'

const database = require('../Database')

class UploadController{
    constructor(){}

    getImage(request, respone){
        console.log(request.files);

        var tmp_path = request.files[0].path;
    
        var target_path = 'uploads/' + request.files[0].originalname;
    
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function() { res.send("ok"); });
        src.on('error', function(err) { res.send({error: "upload failed"}); });
    }


    uploadImage(request, respone){

    }
}

var self = module.exports = new UploadController()