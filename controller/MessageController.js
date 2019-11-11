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

        if(idChat == null){
            database.getAllDocuments('message', {}, {}, value=>{
                respone.json(value)
            })
        }else

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
        let chatIdReq = request.params.chatId
        let fromReq = request.body.from
        let toReq = request.body.to
        let contentReq = request.body.content
        let typeReq = request.body.type
        let timestamp = '11111'

        let query = {_id : chatIdReq}
        let message = {
            messages : "test"
        }

        database.pushToArray('message', {_id : chatIdReq}, { messages: "test" }, result =>{
            respone.json(result)
        })

        
    }

    createNewChat(request, respone){
        let members = JSON.parse(request.body.members)
        let chat = {messages : []}
        database.insertOneDocument('message', chat, result =>{
            let idChat = chat._id
            members.forEach(member => {
                database.pushToArray('user', {username : member}, {chats : idChat}, result =>{
                    respone.json(result)
                })
            })

            respone.json({message : true})            
        })
        
    }
}

module.exports = new MessageController()