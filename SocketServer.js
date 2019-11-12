'use strict'
const io = require('socket.io')
const database = require('./Database')

class SocketServer{
    constructor(server){
        this.socketIO = new io(server)
        this.listUser = new Map()

        this.listen('connection', client => {
            console.log("Connected successfully to socket.io")
            client.on('username', data =>{
                this.listUser.set(data.username, client)
                
                let socket = this.listUser.get('huydv')
            })
        })        

        this.listen('message', data =>{
            console.log(data)
            let socket = this.listUser.get(data.to)
            socket.emit('message', data)
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