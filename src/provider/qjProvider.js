const { pool } = require("../config/database");
const { logger } = require("../config/winston");

const qjDao = require("../dao/qjDao");

// Provider: Read 비즈니스 로직 처리

// 관심 직무 조회
exports.getJob = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const job = await qjDao.getJob(connection, userId);
  connection.release();
  return job;
}

// 과목 데이터 조회
exports.getSubjectInfo = async function () {
  const connection = await pool.getConnection(async (conn) => conn);
  const subjectInfo = await qjDao.getSubjectInfo(connection);
  connection.release();
  return subjectInfo;
}

// 직무 존재 여부 파악(조회)
exports.getJobCheck = async function (job) {
  const connection = await pool.getConnection(async (conn) => conn);
  const jobCheck = await qjDao.getJobCheck(connection, job);
  connection.release();
  return jobCheck;
}