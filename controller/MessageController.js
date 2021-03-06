'use strict'

const database = require('../Database')
const ObjectID = require('mongodb').ObjectID;

class MessageController { 
    constructor (){
    }

    getAllMessages(request, respone){
        let idChat = request.params.idChat
        let page = request.params.page
        let query
        if(idChat)
            query = {_id : ObjectID(idChat)}
        else
            query = {}

        database.getAllDocuments('message', query, {}, value =>{
            if(idChat){
                respone.json(value[0])
            }
            else{
                respone.json(value)
            }
                
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

    getPageMessages(request, respone){
        let idChat = request.params.idChat
        let page = request.params.page
        
        let query
        if(idChat)
            query = {_id : ObjectID(idChat)}
        else
            query = {}
        let messagePerPage  = 10
        
            database.getAllDocuments('message', query, {}, value =>{
                if(idChat){
                    let messages = value[0].messages
                    let count = Math.floor(messages.length / messagePerPage)
                    let pageCount = messages.length % messagePerPage == 0 ?  count - 1 : count

                    //convert string to number
                    let pageNumber = +page
  
                    if(isNaN(page) || page.indexOf(".") > -1 || pageNumber > pageCount || pageNumber < 0 || !Number.isInteger(pageNumber)){
                        value[0].messages = null

                    }else{
                        let endPos = messages.length - messagePerPage * page
                        let startPos = endPos - 10 < 0 ? 0 : endPos - 10
                        let array = messages.slice(startPos, endPos)
                        value[0].messages = array
                    }
                    
                    //console.log(parseInt(request.params.page, 1))
                    value[0].pageCount = pageCount + 1
                    respone.json(value[0])
                    
                }
                else{
                    respone.json(value)
                }     
        })
    }
    // insert message by api
    insertMessage(request, respone){
        let chatIdReq = request.params.idChat
        let fromReq = request.body.from
        let toReq = request.body.to
        let contentReq = request.body.content
        let typeReq = request.body.type
        let timestamp = Math.floor(new Date().getTime())

        let query = {_id : ObjectID(chatIdReq)}
        let message = {
            from : fromReq,
            to : toReq,
            content : contentReq,
            type : typeReq,
            timestamp : timestamp
        }
        console.log(message)
        database.pushToArray('message', query, { messages: message }, result =>{
            result.idChat = chatIdReq
            result.timestamp = timestamp
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
                })
            })
            request.params.idChat = idChat
            self.insertMessage(request, respone)
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

var self = module.exports = new MessageController()