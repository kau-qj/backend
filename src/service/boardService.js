const { pool } = require('../config/database');
const { logger } = require('../config/winston');
const baseResponse = require("../config/baseResponseStatus");
const boardDao = require('../dao/boardDao');
const {errResponse} = require("../config/response");
const {response} = require("../config/response");

// 게시글 생성
exports.createPost = async function (postName, userId, Title, mainText, postType) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.createPost(connection, [postName, userId, Title, mainText, postType]);
        console.log(`게시글 작성 완료. 제목 : ${result[0]}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createPost Service error
: ${err.message}`);
        return err.message;
    }
}

// 게시글 수정
exports.updatePost = async function (PostIdx, Title, mainText) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.updatePost(connection, [Title, mainText, PostIdx]);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - updatePost Service error
: ${err.message}`);
        return err.message;
    }
} 

// 게시글 삭제
exports.deletePost = async function (PostIdx) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const result = await boardDao.deletePost(connection, PostIdx);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - deletePost Service error
: ${err.message}`);
        return err.message;
    }
}

// 댓글 생성
exports.createComment = async function (PostIdx, userId, contents) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    await connection.beginTransaction(); // 트랜잭션 시작
    
    const commentIdx = await boardDao.createComment(connection, PostIdx, userId, contents); // 댓글 
    const comment = await boardDao.selectComment(connection, commentIdx); // 생성된 댓글 조회
    await connection.commit(); // 트랜잭션 커밋
    connection.release();
    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - createComment Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 댓글 삭제
exports.deleteComment = async function (PostIdx, commentIdx, userId) {
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

    return response(baseResponse.SUCCESS);
  } catch (err) {
    logger.error(`App - deleteComment Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};