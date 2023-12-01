const jwtMiddleware = require("../middleware/jwtMiddleware");
const userProvider = require("../provider/userProvider");
const userService = require("../service/userService");
const baseResponse = require("../config/baseResponseStatus");
const {response, errResponse} = require("../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");
const baseResponseStatus = require("../config/baseResponseStatus");

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
    const { userId, userPw, grade, major, phoneNum, school, jobName} = req.body;
    if (!userId) return res.send(errResponse(baseResponse.SIGNUP_USERID_EMPTY));
    if (!userPw) return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if (!grade) return res.send(errResponse(baseResponse.SIGNUP_GRADE_EMPTY));
    if (!major) return res.send(errResponse(baseResponse.SIGNUP_MAJOR_EMPTY));
    if (!phoneNum) return res.send(errResponse(baseResponse.SIGNUP_PHONENUM_EMPTY));
    if (!school) return res.send(errResponse(baseResponse.SIGNUP_SCHOOL_EMPTY));

    const signUpResponse = await userService.createUser(userId, userPw, grade, major, phoneNum, school, jobName);

    return res.send(signUpResponse);
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /app/login
 * body : userId, userPw
 */
exports.login = async function (req, res) {
    try {
        const { userId, userPw } = req.body;

        // TODO: userId, password 형식적 Validation
        if(!userId) return res.send(response(baseResponseStatus.SIGNIN_USERID_EMPTY));
        if(!userPw) return res.send(response(baseResponseStatus.SIGNIN_PASSWORD_EMPTY));

        const signInResponse = await userService.postSignIn(userId, userPw);
        if (!signInResponse) {
            // userService.postSignIn에서 에러가 발생한 경우
            console.error('Login failed:', signInResponse.message);
            return res.status(400).json(signInResponse);
        }

        if (!signInResponse.result || !signInResponse.result.token) {
            // 토큰이 존재하지 않는 경우
            console.error('Token not found in response:', signInResponse);
            return res.status(500).json({
                isSuccess: false,
                code: 5000,
                message: 'Internal Server Error',
            });
        }

        // JWT 토큰을 쿠키에 설정
        res.cookie('access_token', signInResponse.result.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });

        return res.status(200).json(signInResponse);
    } catch (error) {
        // 예상치 못한 에러 처리
        console.error('Unexpected error during login:', error);
        return res.status(500).json({
            isSuccess: false,
            code: 5000,
            message: 'Internal Server Error',
        });
    }
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