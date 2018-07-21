require('dotenv').config()
var database = require('./db/database');
var twitterconsumer = require("twitterconsumer");

var db = new database();

var consume = function (hashtag, callback) {
    client.get('search/tweets', {
        q: hashtag,
        count: 100
    }, function (err, response, resultData) {
        if (err) {
            callback(err, resultData);
            return;
        }
        var data = {
            tables: {
                users: [],
                tweets: []
            }
        }
        resultData.statuses.forEach(status => {
            var userconsumed = JSON.parse(JSON.stringify(status.user));
            var user = {
                id: userconsumed.id,
                name: userconsumed.name,
                screen_name: userconsumed.screen_name,
                followers_count: userconsumed.followers_count,
                created_at: new Date(userconsumed.created_at),
                statuses_count: userconsumed.statuses_count,
                lang: userconsumed.lang
            }
            var tweet = {
                id: status.id,
                user_id: user.id,
                hashtag: hashtag,
                created_at: new Date(status.created_at),
                text: status.text,
                retweet_count: status.retweet_count,
                lang: status.lang
            }
            data.tables.users.push(user);
            data.tables.tweets.push(tweet);
        });
        db.bulkInsertTable(data.tables.users, 'users', (err, result) => {
            if (err) {
                callback(err, result);
                return;
            }
            console.log("Data inserted on table users affected rows: " + result.affectedRows);
            db.bulkInsertTable(data.tables.tweets, 'tweets', (err, result) => {
                if (err) {
                    callback(err, result)
                    return;
                }
                console.log("Data inserted on table tweets affected rows: " + result.affectedRows);
                callback(err, result);
            })

        })
    });

}
var consumeArray = function (hashtags, callback) {
    var hashtagsProcessed = 0;
    hashtags.forEach(hashtag => {
        consume(hashtag, (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            hashtagsProcessed++;
            console.log("Inserted hashtag " + hashtag);
            if(hashtagsProcessed >= hashtags.length) {
                callback(null);
            }
        });

    });
}
hashtags = [
    "#openbanking",
    "#apifirst",
    "#devops",
    "#cloudfirst",
    "#microservices",
    "#apigateway",
    "#oauth",
    "#swagger",
    "#raml",
    "#openapis"
]


var client = new twitterconsumer({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
})

db.connect((err) => {
    if (err) throw err;
    db.drop(db.tables, 0, (err) => {
        if (err) throw err;
        console.log("Tables dropped")
        db.create((err, result) => {
            if (err) throw err;
            console.log("Tables created")
            consumeArray(hashtags, (err, result) => {
                if (err) throw err;
                console.log("Finished Insertion");
                process.exit();
            })
        })
    })
})