const { pool } = require("../config/database");
const { logger } = require("../config/winston");

const mypageDao = require("../dao/mypageDao");
// Provider: Read 비즈니스 로직 처리

// 개인 정보 조회
exports.getMypageInfo = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const mypageInfo = await mypageDao.selectUserByUserId(connection, userId);
    connection.release();
    return mypageInfo;
}

// 프로필 이미지 조회
exports.getUserImage = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userImage = await mypageDao.selectUserImage(connection, userIdx);
    connection.release();
    return userImage;
}

// 프로필 조회
exports.getProfile = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await mypageDao.selectUserByUserId(connection, userId);
    connection.release();
    return result;
}

// qj 조회
exports.getQJ = async function(userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await mypageDao.selectQJ(connection, userId);
    connection.release();
    return result;
}

// qj data 조회
exports.getQJData = async function (setIdx, userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const result = await mypageDao.selectQJData(connection, setIdx, userId);
    connection.release();
    return result;
}