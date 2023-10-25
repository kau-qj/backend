// mypageRouter.js
const express = require('express');
const router = express.Router();
const { pool } = require('../config/database'); // 데이터베이스 연결 풀 가져오기
const mypageService = require('../service/mypageService');

// 마이페이지 정보 가져오기
router.get('/getuserinfo/:userIdx', async (req, res) => {
  const userIdx = req.params.userIdx;

  try {
    const [rows, fields] = await pool.query('SELECT * FROM User WHERE userIdx = ?', [userIdx]);
    res.json(rows);
  } catch (error) {
    console.error('데이터베이스 오류:', error);
    res.status(500).json({ error: '데이터베이스 오류' });
  }
});

// mypage -> QJ보관함
router.get('/:userIdx/QJstorage', (req, res) => {
  // QJ 보관함 라우팅 로직 구현
});

// 마이페이지 -> '프로필 설정' 수정
router.put('/:userIdx', (req, res) => {
  const userIdx = req.params.userIdx;
  const updatedData = req.body; // 클라이언트에서 전송한 업데이트된 데이터
  mypageService.updateProfileSettings(userIdx, updatedData);
  res.json({ message: '프로필 설정이 업데이트되었습니다.' });
});

module.exports = router;
