const express = require('express');
const router = express.Router();
const mypageController = require('../controller/mypageController.js');
const upload = require('../config/multer.js');

// 마이페이지 정보 가져오기
router.get('/getuserinfo/:userIdx', mypageController.getMypageInfo);

// 마이페이지 -> 개인정보 수정
router.put('/updateuserinfo/:userIdx', mypageController.updateMypageInfo);

// 마이페이지 -> QJ 보관함
router.get('/:userIdx/QJstorage', mypageController.getQJStorage);

// 마이페이지 -> 프로필 정보 가져오기
router.get('/getuserprofile/:userIdx', mypageController.getProfileInfo);

// 마이페이지 -> 프로필 설정 수정
router.put('updateuserprofile/:userIdx', mypageController.updateProfileSettings);

// 프로필 이미지 업로드
router.post('/upload', upload.single('image'), mypageController.uploadProfileImage);

module.exports = router;