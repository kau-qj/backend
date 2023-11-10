const mypageDao = require('../dao/mypageDao.js');
const { pool } = require('../config/database.js');

// userIdx를 이용하여 마이페이지 정보 가져오기
function getMypageInfo(userIdx) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const mypageInfo = await mypageDao.selectUserByUserIdx(connection, userIdx);
      connection.release();
      resolve(mypageInfo);
    } catch (error) {
      console.error('Service Error:', error);
      reject(error);
    }
  });
}

// userIdx를 이용하여 마이페이지 개인정보 수정하기
function updateMypageInfo(userIdx, updatedData) {
  // console.log("mypageService updatedData: ", updatedData);

  return new Promise(async (resolve, reject) => {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      // 트랜잭션 시작
      await connection.beginTransaction();

      // userDao.js의 updateUserInfo 함수를 호출하여 유저 정보 업데이트
      //console.log(updatedData);
      const updatedProfile = await mypageDao.updateUserInfo(connection, userIdx, updatedData);

      // 트랜잭션 종료
      await connection.commit();

      // DB 연결 해제
      connection.release();

      resolve(updatedProfile); // 업데이트 결과 반환
    } catch (error) {
      // 업데이트 도중 에러 발생 시 트랜잭션 롤백
      await connection.rollback();

      // DB 연결 해제
      connection.release();

      reject(error); // 에러 처리
    }
  });
}

// userIdx를 이용하여 마이페이지 프로필 수정하기
function updateProfileSettings(userIdx, updatedData) {
  return new Promise(async (resolve, reject) => {
    const connection = await pool.getConnection(async (conn) => conn);
    try {
      await connection.beginTransaction();

      // userDao.js의 updateUserProfile 함수를 호출하여 유저 프로필 업데이트
      const updatedProfile = await mypageDao.updateUserProfile(connection, userIdx, updatedData);

      await connection.commit();
      connection.release();
      resolve(updatedProfile);
    } catch (error) {
      await connection.rollback();
      connection.release();
      console.error('Service Error:', error);
      reject(error);
    }
  });
}


// userIdx를 이용하여 프로필 정보 가져오기
function getProfileInfo(userIdx) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const profileInfo = await mypageDao.selectUserProfileByUserIdx(connection, userIdx);
      connection.release();
      resolve(profileInfo);
    } catch (error) {
      console.error('Service Error:', error);
      reject(error);
    }
  });
}

module.exports = {
  getMypageInfo,
  getProfileInfo,
  updateProfileSettings,
  updateMypageInfo,
};