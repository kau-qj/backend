const express = require('express');
const router = express.Router();
const jobguideController = require('../controller/jobguideController.js');

/* 진로사전 정보 가져오기

*/
router.get('/jobdictinfo', jobguideController.getJobDictInfo);

/* 관심 직무 추가하기
1. 관심 직무를 어디에 추가할건지 -> User 테이블 jobName1, jobName2, jobName3
*/
router.post('/interestjob/:userIdx/:jobname', jobguideController.addInterestJob);

/* 관심 직무 수정하기
고려할 사항
1. 최대 하나만 추가가 가능하니 수정도 하나만 가능해야 함.
2. 진로사전에 없는 정보여도 괜찮음.
3. mypage - 프로필 설정에도 반영이 되어야 함.
  반영할 때는 우선 User 테이블의 jobName만 반영되도록.
*/

/* 직업 세부 정보 가져오기
*/
router.get('/jobdetails/:jobname', jobguideController.getJobDetails);

// User의 관심 직무(jobName) 조회하기
router.get('/interestjobinfo/:userIdx', jobguideController.getMyInterestJobInfo);


module.exports = router;

