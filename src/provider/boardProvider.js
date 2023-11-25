const { pool } = require('../config/database');
const { logger } = require('../config/winston');

const boardDao = require('../dao/boardDao');

exports.retrievePosts = async function (userId, postIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.selectPosts(connection, userId, postIdx);
        connection.release();
        return result;
    } catch (err) {
        logger.error(`App - retrievePosts Provider error
: ${err.message}`);
        return err.message;
    }
}

exports.retrievePost = async function (postIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.selectPost(connection, postIdx);
        connection.release();
        return result;
    } catch (err) {
        logger.error(`App - retrievePost Provider error
: ${err.message}`);
        return err.message;
    }
}

exports.retrieveComments = async function (postIdx) {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const result = await boardDao.selectComments(connection, postIdx);
      connection.release();
      return result;
    } catch (err) {
      logger.error(`App - retrieveComments Provider error: ${err.message}`);
      return err.message;
    }
};