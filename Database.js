'use strict'

const MongoClient = require('mongodb').MongoClient
const assert = require('assert')

// //localhost database
// const url = 'mongodb://localhost:27017'
// const dbName = 'myproject'

//online database 
//const url = 'mongodb+srv://huydv:huydv12345@cluster0-dc94y.mongodb.net/test?retryWrites=true&w=majority'
const url = 'mongodb://admin:JVRcDgjQKFIgeIT2@SG-test-28841.servers.mongodirector.com:50750,SG-test-28840.servers.mongodirector.com:50750,SG-test-28842.servers.mongodirector.com:50750/admin?replicaSet=RS-test-0&ssl=true'
const dbName = 'test'

const mongo = new MongoClient(url, { useNewUrlParser: true })
class Database {
  constructor() {
    mongo.connect((err, client) => {
      console.log("Connected successfully to db")
      this.db = client.db(dbName)
      this.client = client
      //Run cron job
      const job = require('./CronJob')()

    })
  }

  insertDocuments(collectionName, documents, callback) {
    const collection = this.db.collection(collectionName)
    var result = collection.insertMany(documents)
    callback(result)
  }

  insertOneDocument(collectionName, document, callback) {
    const collection = this.db.collection(collectionName)
    var result = collection.insertOne(document)
    callback(result)
  }


  updateOneDocument(collectionName, query, filter, callback) {
    const collection = this.db.collection(collectionName)
    collection.updateOne(query, filter, (error, result) => {

      callback(result)
    })

  }

  deleteDocument(collectionName, condition, callback) {
    const collection = this.db.collection(collectionName)
    var result = collection.remove(condition)
    callback(result)
  }

  getAllDocuments(collectionName, query, filter, callback) {
    const collection = this.db.collection(collectionName)

    var cursor = collection.find(query, filter)
    var rows = []
    cursor.each((err, doc) => {
      if (doc == null)
        callback(rows)
      else
        rows.push(doc)
    })
  }

  getDocuments(collectionName, query, filter, option, callback) {
    const collection = this.db.collection(collectionName)

    var cursor = collection.find(query, filter).sort(option.sort)
    var rows = []
    cursor.each((err, doc) => {
      if (doc == null){
        callback(rows)
        console.log(rows)
      }
        
      else
        rows.push(doc)
    })
  }

  // getAllDocuments(collectionName, query, filter) {
  //   return new Promise((resolve, reject) =>{
  //     const collection = this.db.collection(collectionName)

  //     var cursor = collection.find(query, filter)
  //     var rows = []
  //     cursor.each((err, doc) => {
  //       if (doc == null)
  //         resolve(rows)
  //       else
  //         rows.push(doc)
  //     })
  //   })
  // }

  updateAllDocuments(collectionName, query, filter, callback) {
    const collection = this.db.collection(collectionName)
    let result = collection.updateMany(query, filter, { multi: true }, (error, result)=>{
      if(error)
        console.log(error)
      // else
      //   console.log(result)
    })
    callback(result)
  }

  

  pushToArray(collectionName, query, doc, callback) {
    const collection = this.db.collection(collectionName)

    let filter = { $push: doc }
    try {
      collection.updateOne(query, filter, (error, result) => {
        if (error)
          callback({ message: false, error: error })
        else
          callback({ message: true, result: result })
      })
    }
    catch (e) {
      callback({ message: true, error: e })
    }

  }

  getOneDocument(collectionName, query, filter) {
    return new Promise((resolve, reject) => {
      const collection = this.db.collection(collectionName)

      collection.findOne(query, filter).then(result => {
        resolve(result)
      })
    })

  }

}

module.exports = new Database()