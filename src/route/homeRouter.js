const express = require('express');
const router = express.Router();
const home = require('../controller/homeController');

// // 1. 광고 이미지
// router.get('/', home.getAddvertisements);

// 2. 채용 공고
router.get('/recruit', home.getRecruit);

module.exports = router;