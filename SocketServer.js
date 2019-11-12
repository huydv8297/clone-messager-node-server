'use strict'
const io = require('socket.io')

class SocketServer{
    constructor(server){
        this.socketIO = new io(server)

        this.socketIO.on('connection', (socket) => { 
            console.log("Connected successfully to socket.io");    
        });
         
    }

}

var seft = module.exports = server => new SocketServer(server)