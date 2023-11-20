const jobguideDao = require('../dao/jobguideDao.js');
const { pool } = require('../config/database.js');

// Service : Create, Update, Delete 비즈니스 로직 처리

// 관심 직무 추가
exports.addInterestJob = async function(userId, jobname){
      const connection = await pool.getConnection(async (conn) => conn);
      const interestJobInfo = await jobguideDao.insertInterestJob(connection, userId, jobname);
      connection.release();
      // console.log("interestJobInfo: ", interestJobInfo);
      return interestJobInfo;
}

