const app = require('express')();
const server = require('http').createServer(app);
const socket = require('./SocketServer')(server)

let routes = require('./routes');

routes(app);

server.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:3000');
});

 
module.exports = app;
