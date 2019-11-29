const CallSession = require('../CallSession')

const API_KEY = '46469292'
class CallController{
    constructor(){

    }

    getRoom(){
        let room = new CallSession()
        return {apiKey: API_KEY, sessionId: room.session.sessionId, token: room.token}
    }

    
}

module.exports = new CallController()