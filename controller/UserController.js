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
        var friendReq = request.body.friends
        let user = {isExist : false}
        
        self.checkUserExist(usernameReq, user).then(() => {
            if(user.isExist)
                respone.json({status : false, description :'User have been exist!'})
            else{
                var newUser = {
                    username : usernameReq,
                    password : passwordReq, 
                    fullname : fullnameReq,
                    avatar : avatarReq,
                    friends :  JSON.parse(friendReq)
                }
                self.insertUser(newUser, result =>{
                    delete newUser._id
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

    checkUserLogin(request, callback){
        let usernameReq =  request.headers.username
        let passwordReq = request.headers.password

        let query = {"username" : usernameReq, "password" : passwordReq}
        let filter = {
            _id : 0,
            username : 1,
            password : 0,
            fullname : 1,
            avatar : 1,
            friends : 1
        }

        database.getOneDocument('user', query, filter).then(result =>{
            callback(result)
        })

      }

    login(request, respone) {
        self.checkUserLogin(request, result =>{
            if(result == null){
                respone.json({message : "false"})
            }else{
                result.message = "true"
                respone.json(result)
            }
            
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
            password : 0,
            fullname : 1,
            avatar : 1,
            friends : 0
        }}

        database.getAllDocuments('user', query , filter, value =>{
            if(value == null || value.length == 0){
                respone.json({message : "false", value})
            }else{
                let user = value[0]
                
                user.message ="true"
                respone.json(user)
            }
            
        })
    }

    getAll(request, respone){
        database.getAllDocuments('user', {}, {}, value =>{
            if(!value || !value.length){
                respone.json({message : "false"})
            }else{
                respone.json(value)
            }
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