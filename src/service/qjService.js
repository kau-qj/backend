const { pool } = require("../config/database");
const { logger } = require("../config/winston");

const qjDao = require("../dao/qjDao");

// Service : Create, Update, Delete 비즈니스 로직 처리

exports.insertRgData = async function (userId, job, subjectInfo, gpt) {
    const connection = await pool.getConnection(async (conn) => conn);
    const RgData = await qjDao.insertRgData(connection, userId, job, subjectInfo, gpt);
    connection.release();
    return RgData;
}