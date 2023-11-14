const jwtMiddleware = require("../middleware/jwtMiddleware");
const userProvider = require("../provider/userProvider");
const userService = require("../service/userService");
const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {
    const { userId, userPw, grade, major, phoneNum, school} = req.body;
    if (!userId) return res.send(errResponse(baseResponse.SIGNUP_USERID_EMPTY));
    if (!userPw) return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!grade) return res.send(errResponse(baseResponse.SIGNUP_GRADE_EMPTY));
    if (!major) return res.send(errResponse(baseResponse.SIGNUP_MAJOR_EMPTY));
    if (!phoneNum) return res.send(errResponse(baseResponse.SIGNUP_PHONENUM_EMPTY));
    if (!school) return res.send(errResponse(baseResponse.SIGNUP_SCHOOL_EMPTY));
    // if (!) return res.send(errResponse(baseResponse.SIGNUP_JOBIDX_EMPTY));

    const signUpResponse = await userService.createUser(userId, userPw, grade, major, phoneNum, school);

    return res.send(signUpResponse);
};
/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {
    /*
    #swagger.tags = ['login']
    #swagger.summary = '로그인'
    #swagger.description = 'ID/PW를 입력하여 로그인을 시도합니다.'
    #swagger.responses[1000] = {
        description: "성공 - 로그인 성공",
        content: {
            "application/json": {
                
            }
        }
    }
    */
    const { userId, userPw } = req.body;
    // TODO: email, password 형식적 Validation

    const signInResponse = await userService.postSignIn(userId, userPw);
    // JWT 토큰을 쿠키에 설정
    res.cookie('access_token', signInResponse.result.token, {
        httpOnly: true, // 클라이언트 스크립트에서 쿠키에 접근 불가능
        secure: true, // HTTPS에서만 사용
        sameSite: 'strict', // 쿠키가 다른 사이트로 전송되지 않도록 보호
    });

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname);
        return res.send(editUserInfo);
    }
};











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};