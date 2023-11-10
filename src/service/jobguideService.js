const jobguideDao = require('../dao/jobguideDao.js');
const { pool } = require('../config/database.js');

// 키워드를 이용하여 진로사전 정보 가져오기
function getJobDictInfo(keyword) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const jobDictInfo = await jobguideDao.selectJobInfoByKeyword(connection, keyword);
      connection.release();
      resolve(jobDictInfo);
    } catch (error) {
      console.error('Service Error:', error);
      reject(error);
    }
  });
}

// 직업 세부 정보 가져오기
function getJobDetails(jobname) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const jobDetails = await jobguideDao.selectJobDetailsByName(connection, jobname);
      connection.release();
      resolve(jobDetails);
    } catch (error) {
    console.error('Service Error:', error);
    reject(error);
    }
  });
}

// 관심 직무 추가
function addInterestJob(userIdx, jobname) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const interestJobInfo = await jobguideDao.insertInterestJob(connection, userIdx, jobname);
      connection.release();
      console.log("interestJobInfo: ", interestJobInfo);
      resolve(interestJobInfo);
    } catch (error) {
      console.error('Service Error:', error);
      reject(error);
    }
  });
}


// userIdx를 이용하여 관심 직무 조회
function getMyInterestJobInfo(userIdx) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = await pool.getConnection(async (conn) => conn);
      const interestJobInfo = await jobguideDao.selectInterestJobInfo(connection, userIdx);
      console.log(interestJobInfo);
      connection.release();
      resolve(interestJobInfo);
    } catch (error) {
    console.error('Service Error:', error);
    reject(error);
    }
  });
}

// userIdx를 이용하여 마이페이지의 관심직무 수정하기
function updateInterestJob(userIdx, updatedData) {

  return new Promise(async (resolve, reject) => {
    const connection = await pool.getConnection(async (conn) => conn);
    
    try {
      // 트랜잭션 시작
      await connection.beginTransaction();

      // mypageDao.js의 updateUserProfile 함수를 호출하여 유저 프로필 업데이트
      const updatedProfile = await jobguideDao.updateInterestJob(connection, userIdx, updatedData);

      // 트랜잭션 종료
      await connection.commit();

      // DB 연결 해제
      connection.release();


      // 업데이트 결과 반환
      resolve(updatedProfile);
    } catch (error) {
      // 업데이트 도중 에러 발생 시 트랜잭션 롤백
      await connection.rollback();

      // DB 연결 해제
      connection.release();

      console.error('Service Error:', error);

      // 에러 처리
      reject(error);
    }
  });
}

module.exports = {
  getJobDictInfo,
  getMyInterestJobInfo,
  getJobDetails,
  addInterestJob,
  updateInterestJob,

}
