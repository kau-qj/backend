const express = require('express');
const router = express.Router();

const user = require('../controller/userController');

//1. 회원가입 API
router.post('/app/users', user.postUsers);

//2. 로그인 API
router.post('/app/login', user.login);

module.exports = router;


// // TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// // JWT 검증 API
// // app.get('/app/auto-login', jwtMiddleware, user.check);

// // TODO: 탈퇴하기 API