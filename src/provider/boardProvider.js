const { pool } = require('../config/database');
const { logger } = require('../config/winston');

const boardDao = require('../dao/boardDao');

// 특정 게시판 글 전체 조회
exports.retrievePosts = async function (postType) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.selectPosts(connection, postType);
        connection.release();
        return result;
    } catch (err) {
        logger.error(`App - retrievePosts Provider error: ${err.message}`);
        return err.message;
    }
}

// 특정 게시글 상세보기
exports.retrievePost = async function (PostIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const post = await boardDao.getPost(connection, PostIdx);
        const comments = await boardDao.selectComments(connection, PostIdx);
        if (post) post.comments = comments;
        connection.release();
        return post;
    } catch (err) {
        logger.error(`App - retrievePost Provider error: ${err.message}`);
        return err.message;
    }
}

// 게시글 작성자 조회
exports.retrievePostUserId = async function (postIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const userId = await boardDao.selectPostUserId(connection, postIdx);
        connection.release();
        return userId ? userId : null;
    } catch (err) {
        logger.error(`App - retrievePostUserId Provider error: ${err.message}`);
        return err.message;
    }
}


exports.retrieveComments = async function (PostIdx) {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const result = await boardDao.selectComment(connection, PostIdx);
      connection.release();
      return result;
    } catch (err) {
      logger.error(`App - retrieveComments Provider error: ${err.message}`);
      return err.message;
    }
};
