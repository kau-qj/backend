const jobguideDao = require('../dao/jobguideDao.js');
const { pool } = require('../config/database.js');

// Service : Create, Update, Delete 비즈니스 로직 처리

// 관심 직무 추가
exports.addInterestJob = async function(userId, jobname){
      const connection = await pool.getConnection(async (conn) => conn);
      const interestJobInfo = await jobguideDao.insertInterestJob(connection, userId, jobname);
      connection.release();
      // console.log("interestJobInfo: ", interestJobInfo); // Ex) 관심 직무가 추가되었습니다.
      return interestJobInfo;
}

// 관심 직무 업데이트
exports.updateInterestJob = async function(userId, jobname){
      const connection = await pool.getConnection(async (conn) => conn);
      const interestJobInfo = await jobguideDao.updateInterestJob(connection, userId, jobname);
      connection.release();
      return interestJobInfo;
}
