const {logger} = require("../config/winston");
const {pool} = require("../config/database");
const userProvider = require("../provider/userProvider");
const userDao = require("../dao/userDao");
const baseResponse = require("../config/baseResponseStatus");
const {response} = require("../config/response");
const {errResponse} = require("../config/response");
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 회원가입
exports.createUser = async function (userId, userPw, grade, major, phoneNum, school, jobName, userName, nickName) {
    try {
        const connection = await pool.getConnection();

        // 아이디 중복 확인
        const userIdRows = await userDao.selectUserId(connection, userId);
        if (userIdRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_ID);

        // 닉네임 중복 확인
        const nickNameRows = await userDao.selectUserName(connection, userName);
        if (nickNameRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
        
        // 패스워드 암호화
        const hashedPassword = await crypto.createHash("sha512").update(userPw).digest("hex");
        
        // 회원가입 쿼리
        const insertUserInfoParams = [userId, hashedPassword, grade, major, phoneNum, school, jobName, userName, nickName];
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);

        connection.release();
        return userIdResult;
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// 로그인
exports.postSignIn = async function (userId, userPw) {
    try {
        // 아이디 확인

        const connection = await pool.getConnection();

        const userIdRows = await userDao.selectUserId(connection, userId);

        if (userIdRows.length < 1)
            return errResponse(baseResponse.USER_USERID_NOT_EXIST);

        
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
            secret.JWT_SECRET, // 사용할 secret 키
            {
                expiresIn: '365d' // 토큰 만료 시간
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