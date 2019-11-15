'use strict'
const io = require('socket.io')
const database = require('./Database')
let messageController = require('./controller/MessageController')

class SocketServer{
    constructor(server){
        this.socketIO = new io(server)
        this.listUser = new Map()

        this.listen('connection', client => {
            console.log("Connected successfully to socket.io")

            client.on('username', data =>{
                console.log("add " + data.username + " to list")
                this.listUser.set(data.username, client)
                
               // let socket = this.listUser.get('huydv')
            })

            client.on('message', dataReq =>{
                // console.log(data)
                // let idChat = data.idChat
                // if(idChat == null){
                //     messageController.createNewChat(data, id =>{
                //         let socket = this.listUser.get(data.to)
                //         socket.emit('idChat', id)
                //     })
                // }else{
                //     messageController.insertMessage()
                // }
                console.log("message")
                let data = JSON.parse(dataReq)
                console.log(data)

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
                        let sender = this.listUser.get(data.from) || client
                        let receiver = this.listUser.get(data.to)
                        if(result.idChat){
                            data.idChat = result.idChat
                            sender != null ? sender.emit('message', data) : console.log("sender null")
                            receiver != null ? receiver.emit('message', data) : console.log("receiver null")
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

        })
        
        this.listen('disconnect', client =>{
            console.log("Disconect " + client)
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