const {logger} = require("../config/winston");
const {pool} = require("../config/database");
const userProvider = require("../provider/userProvider");
const userDao = require("../dao/userDao");
const baseResponse = require("../config/baseResponseStatus");
const {response} = require("../config/response");
const {errResponse} = require("../config/response");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const secretKey = 'HoonSecretKey'; // 사용할 secret key

dotenv.config();

// const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (userId, userPw, grade, major, phoneNum, school, jobIdx) {
    try {
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
        const connection = await pool.getConnection();

        const userIdRows = await userDao.selectUserId(connection, userId);

        if (userIdRows.length < 1)
            return errResponse(baseResponse.SIGNIN_ID_WRONG);

        // 입력한 비밀번호를 해싱
        const hashedUserPw = await crypto.createHash("sha512").update(userPw).digest("hex");
        const selectUserPasswordParams = [userId, hashedUserPw];
        const passwordRows = await userDao.selectUserPassword(connection, selectUserPasswordParams);
        // 데이터베이스에서 가져온 해시된 비밀번호
        const dbHashedUserPw = passwordRows[0][0]["userPw"];
        
            // 입력된 비밀번호 해시와 데이터베이스의 해시된 비밀번호 비교
        if (dbHashedUserPw !== hashedUserPw)
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        
        if (userIdRows[0].status === "INACTIVE")
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);

        if (userIdRows[0].status === "DELETED")
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);

        const token = jwt.sign(
            {
                userId: userIdRows[0].userId
                // 기타 정보 추가 가능
            },
            secretKey, // 사용할 secret 키
            {
                expiresIn: '1d' // 토큰 만료 시간 일단 하루로 설정
            }
        );

        return response(baseResponse.SUCCESS, {
            userId: userIdRows[0].userId,
            token: token // 토큰 전달
        });
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