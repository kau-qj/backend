const jobguideDao = require('../dao/jobguideDao.js');
const { pool } = require('../config/database.js');

// Service : Create, Update, Delete 비즈니스 로직 처리

// 관심 직무 추가 또는 업데이트
exports.addOrUpdateInterestJob = async function(userId, jobName){
      const connection = await pool.getConnection(async (conn) => conn);
      const interestJobInfo = await jobguideDao.addOrUpdateInterestJob(connection, userId, jobName);
      connection.release();
      return interestJobInfo;
}

