'use strict'

const database = require('../Database')

class UserController { 
    constructor (){
    }

    register (request, respone) {
        var usernameReq = request.body.username
        var passwordReq = request.body.password
        var fullnameReq = request.body.fullname
        var avatarReq = request.body.avatar
        let user = {isExist : false}
        
        self.checkUserExist(usernameReq, user).then(() => {
            if(user.isExist)
                respone.json({status : false, description :'User have been exist!'})
            else{
                var newUser = {
                    username : usernameReq,
                    password : passwordReq, 
                    fullname : fullnameReq,
                    avatar : avatarReq
                }
                self.insertUser(newUser, result =>{
                    respone.json({status : true, data: newUser})
                })
            }
        })
    }

    checkUserExist(usernameReq, user){
        return new Promise((resolve, reject) => {

            let query = {username : usernameReq}
            let filter = {_id : 0, username : 1}

            database.getOneDocument('user', query, filter)
            .then(result =>{
                if(result != null)
                    user.isExist = true
                else
                    user.isExist = false
                resolve()
            })
        })
    }

    insertUser(user, callback){
        let docs = []
        docs[0] = user
        database.insertDocuments('user', docs, result =>{
            callback(result)
        })
    }

    checkAccountLogin(request, callback){
        let usernameReq =  request.headers.username
        let passwordReq = request.headers.password
    
        const collection = this.db.collection('user')
    
        collection.findOne({"username" : usernameReq, "password" : passwordReq})
        .then( result =>{
          callback(result)
        })
      }

    login(request, respone) {
        database.checkAccountLogin(request, (result) =>{
            respone.json(result)
        })
    }

    logout(request, respone) {
    }

    get (request, respone) {
        let usernameReq = request.params.username

        let query = {username : usernameReq}
        let filter = {fields: {
            _id : 0,
            username : 1,
            fullname : 1,
            avatar : 1
        }}

        database.getAllDocuments('user', query ,filter,(value)=>{
            respone.json(value)
        })
    }

    detail(request, respone) {
        console.log('get user')
        respone.json('aaa')
    }

    update(request, respone) {
        console.log('get user')
        respone.json('aaa')
    }

    store(request, respone) {
        console.log('get user')
        respone.json('aaa')
    }

    delete(request, respone) {
        console.log('get user')
        respone.json('aaa')
    }
}

var self = module.exports = new UserController()