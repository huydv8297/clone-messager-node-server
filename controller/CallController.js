const CallSession = require('../CallSession')

const API_KEY = '46469292'
class CallController{
    constructor(){

    }

    getRoom(request, respone){
        let room = new CallSession()
        room.createSession()
            .then(session => {
                respone.json({apiKey: API_KEY, sessionId: session.sessionId, token: room.getToken()})
            })
    }
}

module.exports = new CallController()