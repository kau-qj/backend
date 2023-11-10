// 키워드를 이용하여 진로사전 정보 가져오기
async function selectJobInfoByKeyword(connection, keyword) {
  const query = `
        SELECT jobname, jobkeyword1, jobkeyword2
        FROM JobDictionary
        WHERE jobname LIKE ? OR jobkeyword1 LIKE ? OR jobkeyword2 LIKE ?
        LIMIT 4;
      `;
  const params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];
  const [rows] = await connection.query(query, params);
  return rows;
}

// 직업 이름과 직업에 대한 설명을 담고 있는 정보 가져오기
async function selectJobDetailsByName(connection, jobname) {
  const query = `
    SELECT jobname, comments
    FROM JobDictionary
    WHERE jobname = ?
  `;
  const [result] = await connection.query(query, [jobname]);
  return result[0];
}

// // 키워드를 이용하여 진로사전 정보 가져오기
// async function selectJobInfoByKeyword(connection, keyword) {
//   const query = `
//         SELECT jobname, comments
//         FROM JobDictionary
//         WHERE jobname LIKE ? OR jobkeyword1 LIKE ? OR jobkeyword2 LIKE ?
//         LIMIT 4;
//       `;
//   const params = [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`];
//   const [rows] = await connection.query(query, params);
//   return rows;
// }


// 관심 직무 추가
async function insertInterestJob(connection, userIdx, jobname) {
  try {
    const cleanedJobName = jobname.trim(); // 공백을 제거한 데이터 사용

    // JobDictionary 테이블에서 jobname에 해당하는 데이터 확인
    const jobInfoQuery = `
      SELECT jobname, comments
      FROM JobDictionary
      WHERE jobname = ?;
    `;
    const [jobInfo] = await connection.query(jobInfoQuery, [cleanedJobName]);

    if (jobInfo.length === 0) {
      return '해당 직업은 존재하지 않습니다.'; // JobDictionary에 해당 직업이 없는 경우
    }

    // User 테이블에서 현재 관심 직무 목록 조회
    const currentInterestJobsQuery = `
      SELECT jobName
      FROM User
      WHERE userIdx = ?;
    `;

    const [currentInterestJobsResult] = await connection.query(currentInterestJobsQuery, [userIdx]);

    if (currentInterestJobsResult.length === 1) {
      let currentInterestJobs = currentInterestJobsResult[0].jobName; // 데이터를 그대로 가져옴

      // null 또는 빈 문자열인 경우 빈 배열로 초기화
      if (currentInterestJobs === null || currentInterestJobs === '') {
        currentInterestJobs = [];
      } 
      else {
        // 관심 직무를 쉼표로 분리하여 배열로 저장
        currentInterestJobs = currentInterestJobs.split(',').map((job) => job.trim());
      }

      // 이미 최대 3개의 관심 직무가 추가된 경우 추가 불가
      if (currentInterestJobs.length >= 3) {
        return '최대 3개의 관심 직무가 등록 가능합니다.';
      }

      // 이미 추가된 직무인지 확인 -> 이미 추가된 직무인 경우 추가 X
      if (currentInterestJobs.includes(cleanedJobName)) { // 정제된 데이터 사용
        return '이미 추가되어 있는 관심 직무 입니다.';
      }

      // 새로운 관심 직무를 추가
      currentInterestJobs.push(cleanedJobName); // 정제된 데이터 사용
      
      // User 테이블의 jobName 필드 업데이트
      const updateInterestJobQuery = `
        UPDATE User
        SET jobName = ?
        WHERE userIdx = ?;
      `;

      const updatedJobName = currentInterestJobs.join(', ');
      // console.log('updatedJobName: ', updatedJobName);

      const updateResult = await connection.query(updateInterestJobQuery, [updatedJobName, userIdx]);

      // console.log("updateResult.affectedRows: ", updateResult.affectedRows);
      
      if (updateResult.affectedRows === 1) {
        // 정제된 데이터 사용
        // console.log('updatedJobName: ', updatedJobName); 
        return updatedJobName; 
      } 
      else {
        // 업데이트에 실패한 경우 에러 처리
        return '업데이트에 실패하였습니다.';
      }
    } 
    else {
      // 해당 사용자를 찾을 수 없는 경우 에러 처리
      return '해당 사용자를 찾을 수 없습니다.';
    }
  } 
  catch (error) {
    console.error('DAO Error:', error);
    throw error;
  }
}



// 관심직무 검색
async function selectInterestJobInfo(connection, userIdx) {
  const selectInterestJobQuery = `
      SELECT jobName
      FROM User
      WHERE userIdx =?;
      `;
  const [userRow] = await connection.query(selectInterestJobQuery, [userIdx]);
  return userRow;
}


// 관심 직무 업데이트
async function updateInterestJob(connection, userIdx, updatedInfo) {
  const fields = ['nickName', 'jobName'];
  const queryValues = [];
  const updateFields = [];
  
  for (const field of fields) {
    if (field in updatedInfo && updatedInfo[field] !== undefined) {
      updateFields.push(`?? = ?`);
      queryValues.push(field, updatedInfo[field]);
    }
  }

  if (updateFields.length === 0) {
    console.log('No fields to update');
    return null;
  }

  queryValues.push(userIdx);

  const updateQuery = `
  UPDATE User 
  SET 
    ${updateFields.join(', ')}
  WHERE userIdx = ?;
`;

// console.log('Executing query:', updateQuery, 'with values:', queryValues);

const updateUserRow = await connection.query(updateQuery, queryValues);

if (updateUserRow.affectedRows === 0) {
  // console.log('No rows were updated');
  return null;
}

return updateUserRow;
}

module.exports = {
  selectJobInfoByKeyword,
  selectJobDetailsByName,
  selectInterestJobInfo,
  insertInterestJob,
  updateInterestJob,
};