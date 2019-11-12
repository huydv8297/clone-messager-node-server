'use strict'
const io = require('socket.io')

class SocketServer{
    constructor(server){
        this.socketIO = new io(server)
        this.listUserOnline = []

        this.listen('connection', socket => {
            this.listUserOnline.push(socket)
            console.log("Connected successfully to socket.io");    
        })
    }

    call(eventName, toUser, data){
        this.socketIO.emmit(eventName, data)
    }

    call(eventName, data){
        this.socketIO.emmit(eventName, data)
    }

    listen(eventName, callback){
        this.socketIO.on(eventName, callback)
    }
}

var seft = module.exports = server => new SocketServer(server)