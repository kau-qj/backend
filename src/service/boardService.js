const { pool } = require('../config/database');
const { logger } = require('../config/winston');
const baseResponse = require("../config/baseResponseStatus");
const boardDao = require('../dao/boardDao');
const {errResponse} = require("../config/response");

// 게시글 생성
exports.createPost = async function (postName, userId, title, mainText, postType) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.createPost(connection, [postName, userId, title, mainText, postType]);
        connection.release();
        console.log(baseResponse.SUCCESS);
        return result
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

// 댓글 생성
exports.createComment = async function (postIdx, userId, contents) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    await connection.beginTransaction(); // 트랜잭션 시작
    
    const commentIdx = await boardDao.createComment(connection, postIdx, userId, contents); // 댓글 
    const comment = await boardDao.selectComment(connection, commentIdx); // 생성된 댓글 조회
    console.log("댓글조회완료");
    await connection.commit(); // 트랜잭션 커밋
    connection.release();
    console.log("커넥션 릴리즈 완료");
    return comment;
  } catch (err) {
    logger.error(`App - createComment Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 댓글 삭제
exports.deleteComment = async function (postIdx, commentIdx, userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    await connection.beginTransaction(); // 트랜잭션 시작
    const comment = await boardDao.selectComment(connection, commentIdx); // 댓글 조회
    console.log("comment: ", comment[0].userId);
    // 댓글이 존재하지 않는 경우
    if (!comment) {
      await connection.rollback(); // 트랜잭션 롤백
      connection.release();
      return errResponse(baseResponse.COMMENT_NOT_FOUND);
    }

    // 댓글 작성자와 요청한 사용자가 일치하지 않는 경우
    if (comment[0].userId !== userId) {
      await connection.rollback(); // 트랜잭션 롤백
      connection.release();
      return errResponse(baseResponse.COMMENT_NOT_WRITER);
    }

    await boardDao.deleteComment(connection, commentIdx); // 댓글 삭제

    await connection.commit(); // 트랜잭션 커밋
    connection.release();

    return baseResponse.SUCCESS;
  } catch (err) {
    logger.error(`App - deleteComment Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};