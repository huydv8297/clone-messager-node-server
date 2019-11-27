'use strict'
var fs = require('fs');
const database = require('../Database')
const path = require('path')
const documentName = 'story'
const prefixPath = '\\w+\\.\\w+$'
const extention = '\\\.[a-zA-Z]+'

class StoryController{
    constructor(){}

    getStory(request, respone){
        let storyId = request.params.storyId
        console.log(storyId)
        database.getOneDocument(documentName, {storyId: storyId},{})
            .then(result => respone.json(result))
    }

    getStories(request, respone){
        
        database.getAllDocuments(documentName, {}, {}, result =>{
            respone.json(result)
        })
    }


    postStory(request, respone){
        let imagePath = request.body.imagePath
        let timestamp = Math.floor(new Date().getTime())
        //let storyId = imagePath.replace(new RegExp(prefixPath), "").replace(new RegExp(extention), "")
        let storyId = imagePath.substring(imagePath.lastIndexOf("/") + 1, imagePath.lastIndexOf("."))
        console.log(storyId)
        let story = {
            storyId: storyId,
            imagePath: imagePath,
            timestamp: timestamp
        }
        database.insertOneDocument(documentName, story, () =>{

        })
    }
}

var self = module.exports = new StoryController()