const {logger} = require("../config/winston");
const {pool} = require("../config/database");
const userProvider = require("../provider/userProvider");
const userDao = require("../dao/userDao");
const baseResponse = require("../config/baseResponseStatus");
const {response} = require("../config/response");
const {errResponse} = require("../config/response");
const dotenv = require('dotenv');

dotenv.config();

// const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (userId, userPw, grade, major, phoneNum, school, jobIdx) {
    try {
        console.log("22222");
        // 이메일 중복 확인
        // const emailRows = await userDao.selectUserEmail(userId);
        
        // if (emailRows.length > 0)
        //     return errResponse(baseResponse.SIGNUP_REDUNDANT_ID);
        
        // 패스워드 암호화
        const hashedPassword = await crypto.createHash("sha512").update(userPw).digest("hex");
        
        const insertUserInfoParams = [userId, hashedPassword, grade, major, phoneNum, school, jobIdx];
        
        const connection = await pool.getConnection();

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
        connection.release();
        
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (userId, userPw) {
    try {
        // 아이디 확인
        const userIdRows = await userDao.selectUserId(userId);

        if (userIdRows.length < 1)
            return errResponse(baseResponse.SIGNIN_ID_WRONG);

        const selectUserPasswordParams = [userId, userPw];
        const passwordRows = await userDao.selectUserPassword(selectUserPasswordParams);

        if (passwordRows[0]["userPw"] !== await crypto.createHash("sha512").update(userPw).digest("hex"))
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);

        if (userIdRows[0].status === "INACTIVE")
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);

        if (userIdRows[0].status === "DELETED")
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);

        return response(baseResponse.SUCCESS, userIdRows);
    } catch (err) {
        logger.error(`App - createSignIn Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUser = async function (userId, nickname) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);

        const editUserInfo = await userDao.updateUserInfo(connection, userId, nickname);

        connection.release();

        return response(baseResponse.SUCCESS, editUserInfo[0]);
    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};