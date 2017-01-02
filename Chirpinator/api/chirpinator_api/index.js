var crypto = require('crypto')
var moment = require("moment")
var AWS = require("aws-sdk")

var dynamodb = new AWS.DynamoDB()
var docClient = new AWS.DynamoDB.DocumentClient()

module.exports = {
  handler: function(event, context) {

    if (event && event.message) {

      console.log("Post...")


      var hashkey = crypto.createHash('md5').update(moment().unix() + event.message).digest("hex")


      var params = {
          TableName: "chirp",
          Item: {
            message: event.message,
            post_id: hashkey,
            created_at: moment().unix(),
            readable_date: moment().format("HH:MM:SS MM.DD.YY")
          }
      }

      docClient.put(params, function(err, data) {
         if (err) {
            context.fail("500")
         } else {
            context.done(null,"Successful Post " + hashkey)
         }
      })

    }else{

      console.log("Get...")

      var params = {
        TableName: "chirp"
      }

      dynamodb.scan(params,function(err, data) {
        context.done(null,data)
      })

    }

  }
}
