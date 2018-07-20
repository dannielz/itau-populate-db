require('dotenv').config()
var mysql = require('mysql');
var dbcon = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME,
    insecureAuth : true
});

const createUserTableQuery ={
    table_name : "user",
    query:
    "CREATE TABLE IF NOT EXISTS `user` (\
    `id` INT NOT NULL,\
    `name` VARCHAR(45) NOT NULL,\
    `screen_name` VARCHAR(45) NOT NULL,\
    `location` VARCHAR(45) NULL,\
    `description` VARCHAR(45) NULL,\
    `followers_count` INT NOT NULL,\
    `created_at` DATETIME NOT NULL,\
    `time_zone` VARCHAR(45) NOT NULL,\
    `statuses_count` INT NOT NULL,\
    `lang` VARCHAR(45) NOT NULL,\
    PRIMARY KEY (`id`))\
  ENGINE = InnoDB;"
}
const createTweetTableQuery ={
    table_name : "tweet",
    query:
    "CREATE TABLE IF NOT EXISTS `tweet` (\
    `id` INT NOT NULL,\
    `user_id` INT NOT NULL,\
    `text` VARCHAR(280) NOT NULL,\
    `hashtag` VARCHAR(45) NOT NULL,\
    `retweet_count` INT NOT NULL,\
    `favorited` INT NOT NULL,\
    `lang` VARCHAR(45) NOT NULL,\
    PRIMARY KEY (`id`),\
    INDEX `fk_tweet_user_idx` (`user_id` ASC),\
    CONSTRAINT `fk_tweet_user`\
      FOREIGN KEY (`user_id`)\
      REFERENCES `user` (`id`)\
      ON DELETE NO ACTION\
      ON UPDATE NO ACTION)\
  ENGINE = InnoDB;"
    }

var Database = function () {
    this.connect = function (callback) {
        dbcon.connect(callback);
    }
    this.end = function (callback) {
        dbcon.end(callback);
    }
    this.create = function (callback) {
        dbcon.query(createUserTableQuery.query, function (err, result) {
            callback(err,createUserTableQuery.table_name);
        });
        dbcon.query(createTweetTableQuery.query, function (err, result) {
            callback(err,createTweetTableQuery.table_name);
        });

    }

    this.insertTweet = function (tweet, callback) {

    }
};
module.exports = Database;