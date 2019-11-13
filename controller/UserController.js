'use strict'

const database = require('../Database')

class UserController {
    constructor() {
    }

    register(request, respone) {
        console.log(request.body.friends)
        var usernameReq = request.body.username
        var passwordReq = request.body.password
        var fullnameReq = request.body.fullname || "default"
        var gender = request.body.gender || "Man"
        var avatarReq = request.body.avatar || "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
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
                    active: activeReq
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
                avatar: 1,
                friends: 1,
                chats: 1,
                active: 1
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
                chats: 1
            }
        }

        hidden.forEach(element => {
            if(element == "_id")
                filter.fields[element] = 0
            else
                delete filter.fields[element]
        })

        return new Promise((resolve, reject) => {
            database.getAllDocuments('user', query, filter, value => {
                if (value == null || value.length == 0) {
                    resolve({ message: false })
                } else {
                    let user = value[0]
                    user.message = true
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
        database.updateAllDocuments('user', { friends: true }, { $set: { friends: [] } }, () => {
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
        let genderReq = request.body.gender
        let avatarReq = request.body.avatar
        let activeReq = request.body.active
        let friendsReq = request.body.friends

        self.getUserInfo(usernameReq, ["_id"])
            .then(user => {
                if (!user.message) {
                    respone.json(user)
                } else {

                    let query = { username: usernameReq }
                    let filter = {
                        $set: {
                            password: passwordReq || user.password,
                            fullname: fullnameReq || user.fullname,
                            gender: genderReq || user.gender,
                            avatar: avatarReq || user.avatar,
                            active: activeReq == "true",
                            friends: friendsReq == null ? user.friends : JSON.parse(friendsReq)
                        }
                    }

                    database.updateOneDocument("user", query, filter, () => {
                        respone.json({ message: true })
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