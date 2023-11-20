const express = require('express');
const router = express.Router();
const jobguideController = require('../controller/jobguideController.js');
const jwt = require('../middleware/jwtMiddleware.js');


// 진로사전 정보 가져오기
router.get('/jobdictinfo', jobguideController.getJobDictInfo);

// 직업 세부 정보 가져오기
router.get('/jobdetails/:jobname', jobguideController.getJobDetails);

// User의 관심 직무(jobName) 조회하기
router.get('/interestjobinfo', jwt, jobguideController.getMyInterestJobInfo);

// 관심 직무 추가하기
router.post('/interestjob/:Jobname', jwt, jobguideController.addInterestJob);

module.exports = router;

