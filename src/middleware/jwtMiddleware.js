const jwt = require('jsonwebtoken');
const { errResponse } = require("../config/response")
const baseResponse = require("../config/baseResponseStatus");

const secret = require('../config/secret');

const jwtMiddleware = async function(req, res, next) {
    if (req.headers.cookie) {
        const token = req.headers.cookie.slice(13);
        /** jwt 검증
         * 쿠키에 저장된 token과 secret키를 비교
         * 비동기 작업
         */
        const p = new Promise((resolve, reject) => {
            jwt.verify(token, secret.JWT_SECRET, (err, decoded) => {
                // 토큰 검증 실패
                if (err) {
                    console.error(err)
                    res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE))
                } else {
                    // 토큰 검증 성공했다면 decoded를 전송(resolve)
                    resolve(decoded)
                }
            })
        })

        // 만약 Promise p가 resolve일 때, 실행될 콜백 함수
        p.then((decoded) => {
            req.decoded = decoded
            next() // 다음 미들웨어 또는 요청 핸들러로 이동
        })

    } else res.send(errResponse(baseResponse.TOKEN_EMPTY));

    // // 헤더에 있는 token 불러오기
    // const headers = req.headers['authorization']
    // console.log("headers:", headers)

    // // 헤더에 있는 token 없을 시, 오류
    // if(!headers) {
    //     return res.send(errResponse(baseResponse.TOKEN_EMPTY))
    // }

    // // 
    // const token = decodeURIComponent(headers.slice(7))
    // console.log("token:", token)
    // // create a promise that decodes the token
    // const p = new Promise(
    //     (resolve, reject) => {
    //         jwt.verify(token, secret_config.jwtsecret, (error, decoded) => {
    //             if(error) {
    //                 console.log(`에러 발생\n ${error}`)
    //             }
    //             console.log("decoded:", decoded)
    //             resolve.send(decoded)
    //         })
    //     }
    // );

    // // if it has failed to verify, it will return an error message
    // const onError = (error) => {
    //     return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE))
    // };
    // // process the promise
    // p.then((verifiedToken)=>{
    //     //비밀 번호 바뀌었을 때 검증 부분 추가 할 곳
    //     req.verifiedToken = verifiedToken;
    //     next();
    // }).catch(onError)
};

module.exports = jwtMiddleware;

// 231104 정훈 수정중
// const jwt = require('jsonwebtoken');
// const secret = require('./secret'); // 시크릿 키를 불러오기 위한 모듈
// const baseResponse = require('../config/baseResponseStatus');
// const { errResponse } = require('../config/response');

// const jwtMiddleware = (req, res, next) => {
//     const token = req.headers['authorization'];

//     if (!token) {
//         return res.send(errResponse(baseResponse.TOKEN_EMPTY));
//     }

//     try {
//         const decoded = jwt.verify(token, secret.JWT_SECRET);

//         if (decoded) {
//             req.verifiedToken = decoded;
//             next();
//         } else {
//             return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAIL));
//         }
//     } catch (err) {
//         console.error(err);
//         if (err.name === 'TokenExpiredError') {
//             return res.send(errResponse(baseResponse.TOKEN_EXPIRED));
//         }
//         return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAIL));
//     }
// };

// module.exports = jwtMiddleware;
