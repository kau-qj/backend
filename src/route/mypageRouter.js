const express = require('express');
const router = express.Router();
const mypageController = require('../controller/mypageController.js');
const upload = require('../config/multer.js');
const jwt = require('../middleware/jwtMiddleware.js');

// 마이페이지 -> 첫 화면 조회(Read)
router.get('/', jwt, mypageController.getMypage);

// 마이페이지 -> 개인정보 조회(Read)
router.get('/info', jwt, mypageController.getMypageInfo);

// 마이페이지 -> 개인정보 수정(Update)
router.put('/info', jwt, mypageController.updateMypageInfo);

// 마이페이지 -> 프로필 정보 가져오기(닉네임, 관심직무)
router.get('/profile', jwt, mypageController.getProfile);

// 마이페이지 -> 프로필 설정 수정
router.put('/profile', jwt, upload.single('profileImage'), async (req, res, next) => {
    try {
      // 이미지 업로드 로직 수행 (s3에 업로드)
      const imageUrl = req.file ? req.file.location : null;
  
      // 이후에 mypageController.updateProfile 호출
      await mypageController.updateProfile(req, res, imageUrl);
    } catch (error) {
      next(error);
    }
});

// 마이페이지 -> QJ 보관함(요약조회)
router.get('/qj', jwt, mypageController.getQJStorage);

// 마이페이지 -> QJ 보관함(상세조회)
router.get('/qj/:setIdx', jwt, mypageController.getqjData);

module.exports = router;