const { pool } = require("../config/database");
const { logger } = require("../config/winston");

const qjDao = require("../dao/qjDao");

// Service : Create, Update, Delete 비즈니스 로직 처리

// gpt call
exports.insertRgData = async function (userId, job, subjectInfo, gpt) {
    const connection = await pool.getConnection(async (conn) => conn);
    const RgData = await qjDao.insertRgData(connection, userId, job, subjectInfo, gpt);
    connection.release();
    return RgData;
}

// 랜덤 setIdx를 바탕으로 insert(db에 이미 관심직무 있었던 경우 gpt call 없이)
exports.insertRgDataWithSetIdx = async function (job, userId) {
    const connection = await pool.getConnection(async (conn) => conn);
  
    // setIdx 랜덤으로 추출(대신, 과목 수가 알맞아야 됨 -> 현재 소학 과목이 총 17개이므로 17으로 임시로 해놓음)
    const randomSetIdx = await qjDao.getRandomSetIdx(connection, job);
  
    const rgData = await qjDao.insertRgDataWithSetIdx(connection, randomSetIdx, userId);
    connection.release();
    return rgData;
}