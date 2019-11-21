'use strict'
var bodyParser = require('body-parser')
var cors = require('cors')
var multer = require('multer')

var upload = multer(
    { 
        limits: {
            fieldNameSize: 999999999,
            fieldSize: 999999999
        },
        dest: 'uploads/' }
    )

module.exports = function(app) {
  let userController = require('./controller/UserController')
  let messageController = require('./controller/MessageController')
  let uploadController = require('./controller/UploadController')

  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(bodyParser.json())

  app.use(cors())

  app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html')
  })

  // todoList Routes
  app.route('/user')
    .post(userController.register)
    

  app.route('/user/:username')
    .get(userController.get)
    .put(userController.update)
    .delete(userController.delete)

  app.route('/login')
    .post(userController.login)
  
  app.route('/message/:idChat')
    .get(messageController.getAllMessages)
    .post(messageController.insertMessage)

  app.route('/message')
    .get(messageController.getAllMessages)
    .post(messageController.createNewChat)
    
  app.route('/all')
    .get(userController.getAll)

  app.route('/addChat')
    .get(userController.addChat)

    
  app.route('/upload')
    .get(uploadController.getImage)
    .post(uploadController.uploadImage)
}