const { pool } = require('../config/database');
const { logger } = require('../config/winston');

const boardDao = require('../dao/boardDao');

// 게시글 생성
exports.createPost = async function (postName, userId, title, mainText, postType, userIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.createPost(connection, [postName, userId, title, mainText, postType, userIdx]);
        connection.release();
        return result;
    } catch (err) {
        logger.error(`App - createPost Service error
: ${err.message}`);
        return err.message;
    }
}

// 게시글 조회
exports.getPosts = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.getPosts(connection);
        connection.release();
        return result;
    } catch (err) {
        logger.error(`App - getPosts Service error
: ${err.message}`);
        return err.message;
    }
}

// 게시글 수정
exports.updatePost = async function (postIdx, title, mainText) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.updatePost(connection, [title, mainText, postIdx]);
        connection.release();
        return result;
    } catch (err) {
        logger.error(`App - updatePost Service error
: ${err.message}`);
        return err.message;
    }
}

// 게시글 삭제
exports.deletePost = async function (postIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.deletePost(connection, postIdx);
        connection.release();
        return result;
    } catch (err) {
        logger.error(`App - deletePost Service error
: ${err.message}`);
        return err.message;
    }
}
