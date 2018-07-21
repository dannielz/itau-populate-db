const pool = require('./pool-factory');

const createUsersTableQuery =

    "CREATE TABLE IF NOT EXISTS `users` (\
    `id` BIGINT NOT NULL,\
    `name` VARCHAR(45) NOT NULL,\
    `screen_name` VARCHAR(45) NOT NULL,\
    `followers_count` INT NOT NULL,\
    `created_at` DATETIME NOT NULL,\
    `statuses_count` INT NOT NULL,\
    `lang` VARCHAR(45) NOT NULL,\
    PRIMARY KEY (`id`))\
  ENGINE = InnoDB;"

const createTweetsTableQuery =
    "CREATE TABLE IF NOT EXISTS `tweets` (\
    `id` BIGINT NOT NULL,\
    `user_id` BIGINT NOT NULL,\
    `hashtag` VARCHAR(45) NOT NULL,\
    `created_at` DATETIME NOT NULL,\
    `text` VARCHAR(280) NOT NULL,\
    `retweet_count` INT NOT NULL,\
    `lang` VARCHAR(45) NOT NULL,\
    PRIMARY KEY (`id`),\
    INDEX `fk_tweet_user_idx` (`user_id` ASC),\
    CONSTRAINT `fk_tweet_user`\
      FOREIGN KEY (`user_id`)\
      REFERENCES `users` (`id`)\
      ON DELETE NO ACTION\
      ON UPDATE NO ACTION)\
  ENGINE = InnoDB;"


var Database = function () 
{
    this.connection;
    this.tables = ['tweets', 'users'];
    this.connect = function(callback){
        pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
                return;
            }
            this.connection = connection;
            callback(err);
        })
    }
    this.drop = function (tables, index, callback) {
        if (index >= tables.length) {
            callback(null)
            return;
        }

        this.connection.query('DROP TABLE IF EXISTS ' + tables[index], (err, result) => {
            if (err) {
                callback(err);
                return;
            }
            this.drop(tables, index + 1, callback);
        })
    }
    this.create = function (callback) {
        this.connection.query(createUsersTableQuery, (err, result) => {
            if (err) {
                callback(err, result);
                return;
            }
            this.connection.query(createTweetsTableQuery, (err, result) => {
                callback(err, result)
            })
        })
    }
    this.bulkInsertTable = function (table, name, callback) {
        var list = [];
        var keys;
        table.forEach(row => {
            keys = Object.keys(row);
            var values = keys.map(function (key) {
                return row[key]
            });
            list.push(values);
        });
        this.connection.query('INSERT IGNORE INTO ' + name + ' (' + keys.join(',') + ') VALUES ?', [list], function (err, result) {
            callback(err, result);
        })
    }
}
module.exports = Database;