const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// DB 계정
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    multipleStatements: true
});

module.exports = { pool };