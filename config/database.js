const mysql = require('mysql2/promise');

// DB 계정
const pool = mysql.createPool({
    host: 'sanhak2023db.cpeuapbltcrz.ap-northeast-2.rds.amazonaws.com',
    user: 'root',
    port: '3306',
    password: '2021125027',
    database: 'sanhakDB',
    multipleStatements: true
});

module.exports = {
    pool: pool
};