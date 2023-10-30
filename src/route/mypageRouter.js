const express = require('express');
const router = express.Router();
const mypageController = require('../controller/mypageController.js');

// 마이페이지 정보 가져오기
router.get('/getuserinfo/:userIdx', mypageController.getMypageInfo);

// 마이페이지 -> 개인정보 수정
// Ex) http://localhost:3000/mypage/updateuserinfo/3
router.put('/updateuserinfo/:userIdx', mypageController.updateMypageInfo);

// 마이페이지 -> QJ 보관함
router.get('/:userIdx/QJstorage', mypageController.getQJStorage);

// 마이페이지 -> 프로필 정보 가져오기
// Ex) http://localhost:3000/mypage/getuserprofile/3
router.get('/getuserprofile/:userIdx', mypageController.getProfileInfo);

// 마이페이지 -> 프로필 설정 수정
// Ex) http://localhost:3000/mypage/updateuserprofile/3
router.put('/updateuserprofile/:userIdx', mypageController.updateProfileInfo);


module.exports = router;