'use strict'
const io = require('socket.io')
const database = require('./Database')

class SocketServer{
    constructor(server){
        this.socketIO = new io(server)
        this.listUserOnline = new Map()

        this.listen('connection', client => {
            console.log("Connected successfully to socket.io")
            client.on('username', data =>{
                this.listUserOnline.set(data.username, client)
                
                let socket = this.listUserOnline.get('huydv')
                console.log(Object.getOwnPropertyNames(socket))
                socket.emit('test', {message : "ahihi"})
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