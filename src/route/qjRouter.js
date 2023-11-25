const express = require('express');
const router = express.Router();
const qj = require('../controller/qjController');

const jwt = require('../middleware/jwtMiddleware');
const gptMiddleware = require('../middleware/gptMiddleware');

// 1. 입력 없이 내 정보 바탕으로 gpt call API
router.get('/myJob', gptMiddleware, qj.getRecommend);

// 2. 관심 직무 입력해서 gpt call API
router.post('/newJob', gptMiddleware, qj.postInputJobRecommend);

module.exports = router;