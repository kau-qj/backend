// mypageService.js
const { pool } = require('../config/database'); // 데이터베이스 연결 풀 가져오기

// 마이페이지 정보 가져오기
function getMypageInfo(userIdx) {
  const query = 'SELECT * FROM User WHERE userIdx = ?';
  const values = [userIdx];

  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, results, fields) => {
      if (error) {
        console.error('데이터베이스 오류:', error);
        reject(error);
      } else {
        console.log('마이페이지 정보:', results);
        resolve(results);
      }
    });
  });
}

// 프로필 설정 업데이트
function updateProfileSettings(userIdx, updatedData) {
  // 프로필 설정 업데이트 로직 구현
}

module.exports = {
  getMypageInfo,
  updateProfileSettings,
};
