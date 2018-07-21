require('dotenv').config({path: '../.env'})
const mysql = require('mysql');
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE_NAME,
});
console.log('pool => created');
pool.on('release', () => console.log('pool => connection returned')); 

process.on('SIGINT', () => 
    pool.end(err => {
        if(err) return console.log(err);
        console.log('pool => closed');
        process.exit(0);
    })
); 

module.exports = pool;