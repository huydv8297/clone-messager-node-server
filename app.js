const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

let routes = require('./routes');
routes(app);

io.on('connection', (socket) => { 
	console.log("Connected successfully to socket.io");    
});
 
server.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:3000');
});

 
module.exports = app;
