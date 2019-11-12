const app = require('express')();
const server = require('http').createServer(app);

let routes = require('./routes');
let socket = require('./SocketServer')(server)

routes(app);

server.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:3000');
});

 
module.exports = app;
