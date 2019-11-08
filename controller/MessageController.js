'use strict'

const database = require('../Database');

class MessageController { 
    constructor (){
    }

    getAllMessages(request, respone){

        let idChat = request.params.idChat;

        let query = [];
        query[0] = { "chats.idChat" : "1"};
        query[1] = {_id: 0, chats: {$elemMatch: {"idChat" : "1"}}}
        let rows = [];
        database.getMessages(query, result => {
            let data = result[0]['data'];
            console.log(data)
            for(let i = 0; i < data.length; i++){
                if(data[i]['from'] == 'huydv')
                    rows.push(data[i]);
                console.log(data[i])
            }
            respone.json(rows);
        });

    }
    
}

module.exports = new MessageController()