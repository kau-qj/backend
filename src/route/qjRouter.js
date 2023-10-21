const express = require('express');
const router = express.Router();

const qj = require('../controller/qjController');

router.get('/qj', qj.getRecommend);

router.post('/qj', qj.postRecommend);

module.exports = router;