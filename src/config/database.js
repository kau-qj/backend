const mysql = require('mysql2/promise');
// const dotenv = require('dotenv');

// dotenv.config();

const secret = require('./secret');

// DB 계정
const pool = mysql.createPool({
    host: secret.DATABASE_HOST,
    user: secret.DATABASE_USER,
    port: secret.DATABASE_PORT,
    password: secret.DATABASE_PASSWORD,
    database: secret.DATABASE_NAME,
    multipleStatements: true
});

module.exports = { pool };