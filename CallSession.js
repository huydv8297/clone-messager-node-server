const OpenTok = require('opentok')

const API_KEY = '46469292'
const API_SECRET = '92be819d12b8e23f8e33d001481540d183b47ea7'
const opentok = new OpenTok(API_KEY, API_SECRET)

class CallSession {
    constructor(){
    }

    createSession(){
        return new Promise((resolve, reject) =>{
            opentok.createSession((error, session) =>{
                if(error){
                    console.log('Error create session')
                    reject(error)
                }
                    
                else{
                    this.session = session
                    resolve(session)
                }
            })
        })
    }


    getToken(){
        let token = this.session.generateToken()
        this.token = token
        return token
    }
}
module.exports = CallSession