'use strict'
var fs = require('fs');
const database = require('../Database')
const path = require('path')
const documentName = 'story'
const prefixPath = '\\w+\\.\\w+$'
const extention = '\\\.[a-zA-Z]+'
const aDayTime = 24 * 60 * 60 * 1000
class StoryController{
    constructor(){}

    getStory(request, respone){
        let storyId = request.params.storyId
        let timeStart = Math.floor(new Date().getTime()) - aDayTime
        console.log(storyId)
        database.getOneDocument(documentName, {storyId: storyId, timestamp: {$gt: timeStart}},{})
            .then(result => respone.json(result))
    }

    getStories(request, respone){
        
        database.getAllDocuments(documentName, {}, {}, result =>{
            respone.json(result)
        })
    }

    cleanExpiredStories(){
        let timeStart = Math.floor(new Date().getTime()) - aDayTime
        database.deleteDocument(documentName, {timestamp: {$lt: timeStart}}, result =>{
            console.log(result)
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
            listView: [],
            timestamp: timestamp
        }
        database.insertOneDocument(documentName, story, result =>{
            respone.json(story)
        })
    }
}

module.exports = new StoryController()