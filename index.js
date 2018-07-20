require('dotenv').config()
var twitterconsumer = require("twitterconsumer");
var database_manager = require("./database_manager");

var client = new twitterconsumer({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
})
var db = new database_manager();
db.connect(function(err){
    if(err) throw err;
    console.log("Connected !!");
    db.create(function(err,table_name){
        if(err) throw err;
        console.log("Table "+ table_name +" Created !!");
    })
})
var getTweetByHashtag = function(hashtag,callback){
    client.get('search/tweets', { q: hashtag, count: 100 }, function(error, response, data) {
        callback
    });
}




//twitterconsumer.printMsg()
