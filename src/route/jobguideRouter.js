const express = require('express');
const router = express.Router();
const jobguideController = require('../controller/jobguideController.js');

/* 진로사전 정보 가져오기

*/
router.get('/getjobdictinfo/:keyword', jobguideController.getJobDictInfo);

// router.put('/updatejobdictionary', jobguideController.func);

/* 관심 직무 추가하기
고려해야 할 것
1. 관심 직무를 어디에 추가할건지 -> 아무래도 User에서 처리하는게 좋아보임.
2. 관심 직무가 있다면 정보를
*/
router.post('/addinterestjob/:userIdx/:jobname', jobguideController.addInterestJob);

/* 관심 직무 수정하기

*/
router.put('/updateinterestjob/:userIdx/:jobname', jobguideController.updateInterestJob);

/* 직업 세부 정보 가져오기

*/
router.get('/getjobdetails/:jobname', jobguideController.getJobDetails);

// 관심 직무 보여주기
router.get('/getinterestjobinfo/:userIdx', jobguideController.getMyInterestJobInfo);


module.exports = router;

