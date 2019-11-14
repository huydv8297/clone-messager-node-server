'use strict'

const database = require('../Database')
const ObjectID = require('mongodb').ObjectID;

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

        database.getAllDocuments('message', {}, {}, value=>{
            respone.json(value[0])
        })

        // if(idChat == null){
        //     database.getAllDocuments('message', {}, {}, value=>{
        //         console.log(value)
        //         respone.json(value)
        //     })
        // }else database.getAllDocuments('message', query, filter, value =>{
        //     // if(value == null || value.length == 0){
        //     //     respone.json(value.messages)
        //     // }else{
        //     //     respone.json(value.messages)
        //     // }
        //     console.log(value)
        //     respone.json(value.messages)
        // })
    }
    // insert message by api
    insertMessage(request, respone){
        let chatIdReq = request.params.idChat
        let fromReq = request.body.from
        let toReq = request.body.to
        let contentReq = request.body.content
        let typeReq = request.body.type
        let timestamp = Math.floor(new Date().getTime()/1000)

        let query = {_id : ObjectID(chatIdReq)}
        console.log("insert message")
        let message = {
            from : fromReq,
            to : toReq,
            content : contentReq,
            type : typeReq,
            timestamp : timestamp
        }
        console.log(message)
        console.log(chatIdReq)
        database.pushToArray('message', query, { messages: message }, result =>{
            result.idChat = idChat
            console.log("insert message push to array" + result)
            respone.json(result)
        })
    }

    // create new chat by api
    createNewChat(request, respone){
        console.log("createNewChat")
        let members = JSON.parse(request.body.members)
        let chat = {messages : []}
        database.insertOneDocument('message', chat, result =>{
            let idChat = chat._id
            members.forEach(member => {
                database.pushToArray('user', {username : member}, {chats : idChat}, result =>{
                    result.idChat = idChat
                    
                })
            })

            respone.json(result)
        })
    }

    // //insert message by socket.io
    // insertMessage(data, callback){
    //     let chatIdReq = data.idChat
    //     let fromReq = data.from
    //     let toReq = data.to
    //     let contentReq = data.content
    //     let typeReq = data.type
    //     let timestamp = Math.floor(new Date().getTime()/1000)

    //     let query = {_id : ObjectID(chatIdReq)}
        
    //     let message = {
    //         from : fromReq,
    //         to : toReq,
    //         content : contentReq,
    //         type : typeReq,
    //         timestamp : timestamp
    //     }

    //     database.pushToArray('message', query, { messages: message }, result =>{
    //         callback(result)
    //     })
    // }

    // //create new chat by socket.io
    // createNewChat(data, callback){
    //     let members = [data.from, data.to]
    //     delete data.idChat
    //     let chat = {messages : [data]}
    //     database.insertOneDocument('message', chat, result =>{
    //         let idChat = chat._id
    //         members.forEach(member => {
    //             database.pushToArray('user', {username : member}, {chats : idChat}, result =>{
    //             })
    //         })

    //         callback(chat._id)
    //     })
    // }
}

module.exports = new MessageController()