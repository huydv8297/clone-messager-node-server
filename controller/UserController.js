'use strict'
const SendMail = require('../mailSender')
const database = require('../Database')
const defaultAvatar = "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
class UserController {
    constructor() {
    }

    register(request, respone) {
        console.log(request.body.friends)
        var usernameReq = request.body.username
        var passwordReq = request.body.password
        var fullnameReq = request.body.fullname || "default"
        var gender = request.body.gender || "Man"
        var avatarReq = request.body.avatar || defaultAvatar
        var friendReq = request.body.friends == null ? [] : JSON.parse(request.body.friends)
        var activeReq = request.body.active == "true" 

        console.log(request.body.friends)
        let user = { isExist: false }

        self.checkUserExist(usernameReq, user).then(() => {
            if (user.isExist)
                respone.json({ message: false, description: 'User have been exist!' })
            else {
                var newUser = {
                    username: usernameReq,
                    password: passwordReq,
                    fullname: fullnameReq,
                    gender: gender,
                    avatar: avatarReq,
                    chats: [],
                    friends: friendReq,
                    active: activeReq,
                    email: null
                }

                self.insertUser(newUser, result => {
                    newUser.message = true
                    delete newUser.password
                    delete newUser._id
                    respone.json(newUser)
                })
            }
        })
    }

    checkUserExist(usernameReq, user) {
        return new Promise((resolve, reject) => {

            let query = { username: usernameReq }
            let filter = { _id: 0, username: 1 }

            database.getOneDocument('user', query, filter)
                .then(result => {
                    if (result != null)
                        user.isExist = true
                    else
                        user.isExist = false
                    resolve()
                })
        })
    }

    insertUser(user, callback) {
        let docs = []
        docs[0] = user
        database.insertDocuments('user', docs, result => {
            callback(result)
        })
    }

    checkUserLogin(request, callback) {
        let usernameReq = request.body.username
        let passwordReq = request.body.password

        let query = { "username": usernameReq, "password": passwordReq }
        let filter = {
            projection: {
                _id: 0,
                username: 1,
                fullname: 1,
                gender:1,
                avatar: 1,
                active: 1,
                friends:1,
                chats: 1,
                stories: 1,
                email: 1
            }
        }

        database.getOneDocument('user', query, filter).then(result => {
            callback(result)
        })

    }

    login(request, respone) {
        self.checkUserLogin(request, result => {
            if (result == null) {
                respone.json({ message: false })
            } else {
                result.message = true
                respone.json(result)
            }
        })
    }


    get(request, respone) {
        let usernameReq = request.params.username
        console.log("get info")
        self.getUserInfo(usernameReq, ["_id", "password"])
            .then(result => {
                console.log(result)
                respone.json(result)
            })
    }

    getUserInfo(usernameReq, hidden) {
        let query = { username: usernameReq }
        let filter = {
            fields: {
                _id: 1,
                password: 1,
                username: 1,
                fullname: 1,
                gender:1,
                avatar: 1,
                active: 1,
                friends:1,
                chats: 1,
                stories: 1,
                email: 1
            }
        }
        console.log("getUserInfo1")
        hidden.forEach(element => {
            if(element == "_id")
                filter.fields[element] = 0
            else
                delete filter.fields[element]
        })

        console.log("getUserInfo2")

        return new Promise((resolve, reject) => {
            database.getAllDocuments('user', query, filter, value => {
                console.log("getUserInfo3")
                if (value == null || value.length == 0) {
                    resolve({ message: false })
                } else {
                    let user = value[0]
                    user.message = true
                    console.log("getUserInfo4")
                    resolve(user)
                }
            })
        })
    }

    getAll(request, respone) {
        
        database.getAllDocuments('user', {}, {}, value => {
            if (!value || !value.length) {
                respone.json({ message: false })
            } else {
                respone.json(value)
            }
        })
    }

    addChat(request, respone) {
        database.updateAllDocuments('user', {}, { $set: { email: null } }, result => {
            respone.json(result)
        })
    }

    update(request, respone) {
        let usernameReq = request.params.username
        let passwordReq = request.body.password
        let fullnameReq = request.body.fullname
        let genderReq = request.body.gender
        let avatarReq = request.body.avatar
        let activeReq = request.body.active
        let friendsReq = request.body.friends
        let chatsReq = request.body.chats
        let storiesReq = request.body.stories
        let emailRep = request.body.email || "default"

        self.getUserInfo(usernameReq, ["_id"])
            .then(user => {
                if (!user.message) {
                    respone.json(user)
                } else {

                    let query = { email: emailRep }
                    let filter = {
                        $set: {
                            password: passwordReq || user.password,
                            fullname: fullnameReq || user.fullname,
                            gender: genderReq || user.gender,
                            avatar: avatarReq || user.avatar,
                            active: activeReq == "true",
                            friends: friendsReq == null ? user.friends : JSON.parse(friendsReq),
                            chats: chatsReq == null ? user.chats : JSON.parse(chatsReq),
                            stories: storiesReq == null ? user.stories : JSON.parse(storiesReq),
                            email: emailRep || user.email
                        }
                    }

                    //check duplicate email
                    if(emailRep != "default")
                    database.getOneDocument("user", query, {})
                        .then(result =>{
                            if(!result)
                                database.updateOneDocument("user", query, filter, () => {
                                    respone.json({ message: true })
                                })
                            else
                                respone.json({message: false})
                        })

                }
            })


    }

    forgotPassword(request, respone){
        let username = request.body.username
        database.getOneDocument("user", {username: username}, {})
            .then(user =>{
                let sendContent = {}
                let newPassword = Math.random().toString(12).substring(2, 6) + Math.random().toString(12).substring(2, 6)

                sendContent.to = user.email
                sendContent.subject = "Quên mật khẩu"
                sendContent.text = "Quên mật khẩu"
                sendContent.html = "Mật khẩu mới của bạn là " +  newPassword
                
                database.updateOneDocument("user", {username: username}, {$set: {password: newPassword}}, result =>{
                        SendMail(sendContent)
                        respone.json({message: true})
                })
                
                console.log(user)
                
        })
    }

}

var self = module.exports = new UserController()