const { pool } = require('../config/database');
const { logger } = require('../config/winston');

const boardDao = require('../dao/boardDao');

exports.retrievePosts = async function () {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.selectPosts(connection);
        connection.release();
        return result;
    } catch (err) {
        logger.error(`App - retrievePosts Provider error
: ${err.message}`);
        return err.message;
    }
}