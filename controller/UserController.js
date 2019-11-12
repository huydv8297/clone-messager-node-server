'use strict'

const database = require('../Database')

class UserController { 
    constructor (){
    }

    register (request, respone) {
        var usernameReq = request.body.username
        var passwordReq = request.body.password
        var fullnameReq = request.body.fullname || "default"
        var avatarReq = request.body.avatar || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
        var friendReq = request.body.friends == null ? [] : JSON.parse(friendReq)
        let user = {isExist : false}
        
        self.checkUserExist(usernameReq, user).then(() => {
            if(user.isExist)
                respone.json({message : false, description :'User have been exist!'})
            else{
                var newUser = {
                    username : usernameReq,
                    password : passwordReq, 
                    fullname : fullnameReq,
                    avatar : avatarReq,
                    chats : [],
                    friends :  friendReq,
                    active : true
                }

                self.insertUser(newUser, result =>{
                    newUser.message = true
                    delete newUser.password
                    delete newUser._id
                    respone.json(newUser)
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
        let usernameReq =  request.body.username
        let passwordReq = request.body.password

        let query = {"username" : usernameReq, "password" : passwordReq}
        let filter = {projection: {
                _id : 0,
                username : 1,
                fullname : 1,
                avatar : 1,
                friends : 1,
                chats : 1, 
                active : 1
            }
        }

        database.getOneDocument('user', query, filter).then(result =>{
            callback(result)
        })

      }

    login(request, respone) {
        self.checkUserLogin(request, result =>{
            if(result == null){
                respone.json({message : false})
            }else{
                result.message = true
                respone.json(result)
            }
            
        })
    }

    logout(request, respone) {
    }

    get (request, respone) {
        let usernameReq = request.params.username

        self.getUserInfo(usernameReq)
            .then( result =>{
                respone.json(result)
            })
    }

    getUserInfo(usernameReq){
        let query = {username : usernameReq}
        let filter = {fields: {
            _id : 0,
            username : 1,
            fullname : 1,
            avatar : 1,
            active : 1
        }}

        return new Promise((resolve, reject) =>{
            database.getAllDocuments('user', query , filter, value =>{
                if(value == null || value.length == 0){
                    resolve({message : false, value})
                }else{
                    let user = value[0]
                    user.message = true
                    resolve(user)
                }
            })
        })
    }

    getAll(request, respone){
        database.getAllDocuments('user', {}, {}, value =>{
            if(!value || !value.length){
                respone.json({message : false})
            }else{
                respone.json(value)
            }
        })
    }

    addChat(request, respone){
        database.updateAllDocuments('user', {friends : true}, {$set : {friends : []}}, ()=>{
            respone.json('add chats to all user')
        })
    }

    detail(request, respone) {
        console.log('get user')
        respone.json('aaa')
    }

    update(request, respone) {
        let usernameReq = request.params.username
        let passwordReq = request.body.password
        let fullnameReq = request.body.fullname 
        let avatarReq = request.body.avatar

        self.getUserInfo(usernameReq)
            .then(user =>{
                if(!user.message){
                    respone.json(user)
                }else{

                    let query = {username : usernameReq}
                    let filter = {
                        password : passwordReq || user.password,
                        fullname : fullnameReq || user.fullname,
                        avatar : avatarReq || user.avatar
                    }

                    database.updateOneDocument("user", query, filter, () =>{
                        respone.json({message : true})
                    })
                    
                }
            })
        
        
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