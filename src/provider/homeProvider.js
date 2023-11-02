const { pool } = require("../config/database");
const { logger } = require("../config/winston");

const homeDao = require("../dao/homeDao");

// Provider: Read 비즈니스 로직 처리

exports.getRecruit = async function () {
    const connection = await pool.getConnection(async (conn) => conn);
    const recruit = await homeDao.getRecruit(connection);
    connection.release();
    return recruit;
}