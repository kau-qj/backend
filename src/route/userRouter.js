const express = require('express');
const router = express.Router();
const jwtMiddleware = require('../middleware/jwtMiddleware');

const user = require('../controller/userController');

router.get('/app/test', user.getTest);

//1. 회원가입 API
router.post('/app/users', user.postUsers);

//2. 로그인 API
router.post('/app/login', user.login);

// endpoint 접근할 때마다 jwtMiddleware 실행하여 토큰 검증
router.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);

module.exports = router;

// //  주석시작
// module.exports = function(app){
//     const user = require('../controller/userController');
//     // const jwtMiddleware = require('../middleware/jwtMiddleware');

//     // 0. 테스트 API
//     app.get('/app/test', user.getTest)

//     // 1. 유저 생성 (회원가입) API
//     app.post('/app/users', user.postUsers);

//     // 2. 유저 조회 API (+ 검색)
//     app.get('/app/users',user.getUsers); 

//     // 3. 특정 유저 조회 API
//     app.get('/app/users/:userId', user.getUserById);

//     // TODO: After 로그인 인증 방법 (JWT)
//     // 로그인 하기 API (JWT 생성)
//     app.post('/app/login', user.login);

//     // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
//     app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)
// };


// // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// // JWT 검증 API
// // app.get('/app/auto-login', jwtMiddleware, user.check);

// // TODO: 탈퇴하기 API