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

// User의 관심직무가 있는 지 조회
exports.getInterestJob = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const currentInterestJobResult = await jobguideDao.selectInterestJob(connection, userId);
    connection.release();
    return currentInterestJobResult;
};


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


