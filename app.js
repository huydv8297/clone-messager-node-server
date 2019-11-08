const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let routes = require('./routes');
routes(app);

io.on('connection', (socket) => { 
	console.log("Connected successfully to socket.io");    
});
 
server.listen(3000, function(){
  console.log('listening on *:3000');
});

 
module.exports = app;
