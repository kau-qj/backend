const { pool } = require("../config/database");
const { logger } = require("../config/winston");

const jobguideDao = require("../dao/jobguideDao.js");

// Provider: Read 비즈니스 로직 처리

// 진로사전 정보 가져오기
exports.getJobDictInfo = async function (userId) {
      const connection = await pool.getConnection(async (conn) => conn);
      const jobDictInfo = await jobguideDao.selectJobInfoByKeyword(connection, userId);
      connection.release();
      return jobDictInfo;
}

// 직업 세부 정보 가져오기
exports.getJobDetails = async function (jobname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const jobDetails = await jobguideDao.selectJobDetailsByName(connection, jobname);
  connection.release();
  return jobDetails;
}

// 이미지 URL 가져오기
exports.getImageUrlByJobname = async function (jobname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const imageUrl = await jobguideDao.selectImageUrlByJobname(connection, jobname);
  connection.release();
  return imageUrl;
}


// userId를 이용하여 관심 직무 조회
exports.getMyInterestJobInfo = async function (userId) {
      const connection = await pool.getConnection(async (conn) => conn);
      const interestJobInfo = await jobguideDao.selectInterestJobInfo(connection, userId);
      console.log(interestJobInfo);
      connection.release();
      return interestJobInfo;
}
