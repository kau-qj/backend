const { pool } = require('../config/database');

// 게시물 생성
exports.createBoardPost = async (post) => {
    try {
        const { postName, userId, title, mainText, postType, userIdx } = post;
        const connection = await pool.getConnection(async (conn) => conn);
        const createPostQuery = `
            INSERT INTO Post (postName, userId, title, mainText, postType, userIdx)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        const [createPostRow] = await connection.query(createPostQuery, [postName, userId, title, mainText, postType, userIdx]);
        connection.release();
        return { postId: createPostRow.insertId };
    } catch (error) {
        throw new Error(error.message);
    }
};

// 게시물 조회
exports.getBoardPostById = async (postId) => {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const selectPostQuery = `
            SELECT postId, postName, userId, title, mainText
            FROM Post
            WHERE postId = ?;
        `;
        const [postRow] = await connection.query(selectPostQuery, postId);
        connection.release();
        return postRow;
    } catch (error) {
        throw new Error(error.message);
    }
};
