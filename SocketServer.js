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
                //let data = JSON.parse(dataReq)
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
                        let sender = this.listUser.get(data.from) || client
                        let receiver = this.listUser.get(data.to)
                        if(result.idChat){
                            data.idChat = result.idChat
                            sender != null ? sender.emit('message', data) : console.log("sender null")
                            receiver != null ? receiver.emit('message', data) : console.log("receiver null")

                            console.log(this.listUser.keys())
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