'use strict'

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

// //localhost database
// const url = 'mongodb://localhost:27017'
// const dbName = 'myproject'

//online database 
//const url = 'mongodb+srv://huydv:huydv12345@cluster0-dc94y.mongodb.net/test?retryWrites=true&w=majority'
const url = 'mongodb://admin:4hJLoYfz6KaNbdZQ@SG-test-27697.servers.mongodirector.com:50482,SG-test-27698.servers.mongodirector.com:50482,SG-test-27699.servers.mongodirector.com:50482/admin?replicaSet=RS-test-0&ssl=true'
const dbName = 'test'

const mongo = new MongoClient(url, { useNewUrlParser: true })
class Database{
  constructor(){
    mongo.connect((err, client) => {
      console.log(err)
      console.log("Connected successfully to db")
      this.db = client.db(dbName)
      this.client = client
    })
  }

  insertDocuments(collectionName, documents, callback) {
    const collection = this.db.collection(collectionName)
    var result = collection.insertMany(documents)
    callback(result)
  }

  updateDocuments(collectionName, query, filter, callback){
    const collection = this.db.collection(collectionName)
    var result = collection.update(query, filter)
    callback(result)
  }

  deleteDocument(collectionName, condition, callback){
    const collection = this.db.collection(collectionName)
    var result = collection.remove(condition)
    callback(result)
  }

  getAllDocuments(collectionName, query, filter, callback){
    const collection = this.db.collection(collectionName)

    var cursor = collection.find(query, filter)
    var rows = []
    cursor.each((err, doc) => {
      if(doc == null)
        callback(rows) 
      else 
        rows.push(doc)
    })     
  }

  getOneDocument(collectionName, query, filter){
    return new Promise((resolve, reject) =>{
      const collection = this.db.collection(collectionName)

      collection.findOne(query, filter).then( result =>{
        resolve(result)
      })
    })
   
  }

  getMessages(query, callback){
    const collection = this.db.collection('message')

    // collection.aggregate(query, (error, data) => {
    //   callback(error, data)
    // })
    var cursor = collection.find(
      {"data.from" : "huydv"},
      {data :{
        $elemMatch :{
          from : "huydv"}}
      })

    var rows = []
    cursor.each((err, doc) => {
      if(doc == null)
        callback(rows)
      else 
        rows.push(doc)
    })   
  }

  // checkAccountLogin(request, callback){
  //   let usernameReq =  request.body.username
  //   let passwordReq = request.body.password

  //   const collection = this.db.collection('user')

  //   collection.findOne({"username" : usernameReq, "password" : passwordReq})
  //   .then( result =>{
  //     callback(result)
  //   })
  // }

}

module.exports = new Database()