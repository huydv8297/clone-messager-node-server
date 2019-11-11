'use strict'

const database = require('../Database')

class MessageController { 
    constructor (){
    }

    getAllMessages(request, respone){
        let idChat = request.params.idChat
        let query = {_id : idChat}
        let filter = {
            _id : 0,
            messages : 1
        }

        database.getAllDocuments('message', query, filter, value =>{
            // if(value == null || value.length == 0){
            //     respone.json(value.messages)
            // }else{
            //     respone.json(value.messages)
            // }
            respone.json(value.messages)
        })

    }

    insertMessage(request, respone){
        let chatId = request.body.chatId
        let from = request.body.from
        let to = request.body.to
        let content = request.body.content
        let type = request.body.type
        let timestamp = new Date().now

        let query = {chatId : chatId}
        let filter = { $push : {
            from : from,
            to : to,
            content : content,
            type : type,
            timestamp : timestamp
        }}

        database.updateDocuments('message', query, filter, () =>{
            respone.json({message : true})
        })
    }

    createNewChat(request, respone){
        let members = JSON.parse(request.body.members)
        let chat = {messages : []}
        database.insertOneDocument('message', chat, result =>{
            let idChat = chat._id
            members.forEach(member => {
                database.pushToArray('user', {username : member}, {chats : idChat}, ()=>{})
            })

            respone.json({message : true})            
        })
        
    }
}

module.exports = new MessageController()