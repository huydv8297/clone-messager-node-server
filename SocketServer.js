'use strict'
const io = require('socket.io')
const database = require('./Database')
let messageController = require('./controller/MessageController')
let callController = require('./controller/CallController')
class SocketServer{
    constructor(server){
        this.socketIO = new io(server)
        this.listUser = new Map()

        this.listen('connection', client => {
            console.log("Connected successfully to socket.io")

            client.on('username', dataReq =>{
                let data = JSON.parse(dataReq)
                console.log(dataReq)
                console.log("add " + data.username + " to list")
                this.listUser.set(data.username, client)
            })

            client.on('disconnect', client =>{
                console.log("disconect " + client)
            })

            client.on('message', dataReq =>{

                console.log("message")
                let data = JSON.parse(dataReq)
                console.log(data)
                console.log("add " + data.from + " to userlist")
                this.listUser.set(data.from, client)

                let request = {
                    params: {
                        idChat: data.idChat
                    },
                    body: {
                        from: data.from,
                        to: data.to,
                        content: data.content,
                        type: data.type,
                        members: '["' + data.from + '", ' + '"' + data.to + '"]'
                    }
                }

                let respone = {
                    json: result =>{
                        let sender = client
                        let receiver = this.listUser.get(data.to)
                        if(result.idChat){
                            data.idChat = result.idChat
                            data.timestamp = result.timestamp
                            if(data.type == 4){
                                console.log("result.type == 4")
                                callController.getRoom(
                                    session => {
                                        data.content = session.sessionId  + ":" + session.token

                                        sender != null ? sender.emit('message', data) : console.log("sender null")
                                        receiver != null ? receiver.emit('message', data) : console.log("receiver null")
                                    }
                                )
                            }else{
                                console.log(data)
                                sender != null ? sender.emit('message', data) : console.log("sender null")
                                receiver != null ? receiver.emit('message', data) : console.log("receiver null")
                            }
                            //     sender != null ? sender.emit('message', data) : console.log("sender null")
                            //     receiver != null ? receiver.emit('message', data) : console.log("receiver null")
                            // console.log(this.listUser.keys())
                        }else{
                            console.log("not send")
                        }
                            
                    }
                }
                //messageController.insertMessage(request, respone)
                if(!data.idChat){
                    messageController.createNewChat(request, respone)
                }else{
                    messageController.insertMessage(request, respone)
                }
                
            })

            client.on('videoCall', dataReq =>{
                let data = JSON.parse(dataReq)
                let caller = this.listUser.get(data.from)
                let receiver = this.listUser.get(data.to)
                console.log('onvideocall ' + dataReq)
                switch(data.status){
                    case 'CALL':
                        if(receiver == null){
                            data.status = 'CANCEL'
                            caller.emit('videoCall', data)
                        }else{
                            callController.getRoom(
                                session => {
                                    data.status = 'WAIT'
                                    data.sessionId = session.sessionId 
                                    data.token = session.token
                                    console.log(data)
                                      
                                    caller.emit('videoCall', data)
                                    receiver.emit('videoCall', data)
                                }
                            )
                        } 
                        break
                    case 'WAIT':

                        break
                    case 'ACCEPT': case 'CANCEL': case 'FINISH':
                        caller.emit('videoCall', data)
                        receiver.emit('videoCall', data)
                        break
                        
                }
            })

        })
    }

    call(eventName, socket, data){
        socket.emit(eventName, data)
    }

    call(eventName, data){
        this.socketIO.emit(eventName, data)
    }

    listen(eventName, callback){
        this.socketIO.on(eventName, callback)
    }
}

module.exports = server => new SocketServer(server)