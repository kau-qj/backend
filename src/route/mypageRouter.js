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
    let imageUrl = null;
    
    // Case 1: 이미지 파일이 등록되지 않은 경우 (null)
    if (req.body.s3ImageUrl === null) {
      imageUrl = null;
    } else if (req.file && req.file.location) {
      // Case 2: 이미지 파일을 최초로 등록하는 경우 (현재 imeageUrl이 S3로 처리 되지않은 경우)
      imageUrl = req.file.location;
    } else if (req.body.s3ImageUrl) {
      // Case 3: 이미지 파일을 등록한 적이 있어서 url로 저장되어 있는 경우(현재 imageUrl이 S3로 처리 되어있는 경우)
      imageUrl = req.body.s3ImageUrl;
    }

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