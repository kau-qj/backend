// 진로사전 정보 가져오기
async function selectJobInfoByKeyword(connection) {
  const query = `
        SELECT jobname
        FROM JobDictionary
        ORDER BY 
    CASE 
      WHEN jobname REGEXP '^[ㄱ-ㅎ가-힣]' THEN 1 
      ELSE 2 
    END, 
    jobname ASC
      `;
  const [rows] = await connection.query(query);
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

// 이미지 URL 가져오기
async function selectImageUrlByJobname(connection, jobname) {
  const query = `
    SELECT imageUrl
    FROM job_directory_images
    WHERE Idx = (
      SELECT jobIdx
      FROM JobDictionary
      WHERE jobname = ?
    )
  `;
  const [result] = await connection.query(query, [jobname]);
  return result[0]?.imageUrl || null;
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

// 관심 직무 최대 하나로 추가 User 테이블의 jobName
async function insertInterestJob(connection, userId, jobname) {
  try {
    const cleanedJobName = String(jobname).trim();; // 공백을 제거한 데이터 사용

    // JobDictionary 테이블에서 jobname에 해당하는 데이터 확인
    const jobInfoQuery = `
      SELECT jobname, comments
      FROM JobDictionary
      WHERE jobname = ?;
    `;
    const [jobInfo] = await connection.query(jobInfoQuery, [cleanedJobName]);

    // 해당 직업이 존재하지 않는 경우
    if (jobInfo.length === 0) {
      return '해당 직업은 존재하지 않습니다.';
    }

    // User 테이블에서 현재 관심 직무 목록 조회
    const currentInterestJobQuery = `
      SELECT jobName
      FROM User
      WHERE userId = ?;
    `;
    const [currentInterestJobResult] = await connection.query(currentInterestJobQuery, [userId]);

    // 해당 사용자의 관심 직무가 이미 있는 경우
    if (currentInterestJobResult.length === 1 && currentInterestJobResult[0].jobName) {
      return '최대 한 개의 관심 직무 등록이 가능합니다.';
    }

    // User 테이블의 jobName1 필드에 관심 직무 업데이트
    const updateInterestJobQuery = `
      UPDATE User
      SET jobName = ?
      WHERE userId = ?;
    `;
    await connection.query(updateInterestJobQuery, [cleanedJobName, userId]);

    // 성공 메시지 반환
    return '관심 직무가 추가되었습니다.';
  } catch (error) {
    console.error('DAO Error:', error);
    throw error;
  }
}



// 관심 직무 추가 -> 마이페이지 진로 보관함으로 추가.
// User 테이블의 jobName
// async function insertInterestJob(connection, userIdx, jobname) {
//   try {
//     const cleanedJobName = jobname.trim(); // 공백을 제거한 데이터 사용

//     // JobDictionary 테이블에서 jobname에 해당하는 데이터 확인
//     const jobInfoQuery = `
//       SELECT jobname, comments
//       FROM JobDictionary
//       WHERE jobname = ?;
//     `;
//     const [jobInfo] = await connection.query(jobInfoQuery, [cleanedJobName]);

//     if (jobInfo.length === 0) {
//       return '해당 직업은 존재하지 않습니다.';
//     }

//     // User 테이블에서 현재 관심 직무 목록 조회
//     const currentInterestJobsQuery = `
//       SELECT jobName1, jobName2, jobName3
//       FROM User
//       WHERE userIdx = ?;
//     `;
//     const [currentInterestJobsResult] = await connection.query(currentInterestJobsQuery, [userIdx]);

//     if (currentInterestJobsResult.length === 1) {
//       const userJobs = currentInterestJobsResult[0];
      
//       // 이미 최대 3개의 관심 직무가 추가된 경우 추가 불가
//       if (userJobs.jobName1 && userJobs.jobName2 && userJobs.jobName3) {
//         return '최대 3개의 관심 직무가 등록 가능합니다.';
//       }

//       // 이미 추가된 직무인지 확인
//       if (Object.values(userJobs).includes(cleanedJobName)) {
//         return '이미 추가되어 있는 관심 직무입니다.';
//       }

//       // 새로운 관심 직무를 추가할 위치 찾기
//       let fieldToUpdate = '';
//       if (!userJobs.jobName1) fieldToUpdate = 'jobName1';
//       else if (!userJobs.jobName2) fieldToUpdate = 'jobName2';
//       else if (!userJobs.jobName3) fieldToUpdate = 'jobName3';

//       // User 테이블의 해당 필드 업데이트
//       const updateInterestJobQuery = `
//         UPDATE User
//         SET ${fieldToUpdate} = ?
//         WHERE userIdx = ?;
//       `;
//       await connection.query(updateInterestJobQuery, [cleanedJobName, userIdx]);

//       return '관심 직무가 추가되었습니다.';
//     } else {
//       // 해당 사용자를 찾을 수 없는 경우 에러 처리
//       return '해당 사용자를 찾을 수 없습니다.';
//     }
//   } catch (error) {
//     console.error('DAO Error:', error);
//     throw error;
//   }
// }



// 관심직무 검색
async function selectInterestJobInfo(connection, userId) {
  const selectInterestJobQuery = `
      SELECT jobName
      FROM User
      WHERE userId =?;
      `;
  const [userRow] = await connection.query(selectInterestJobQuery, [userId]);
  return userRow;
}


module.exports = {
  selectJobInfoByKeyword,
  selectJobDetailsByName,
  selectInterestJobInfo,
  selectImageUrlByJobname,
  insertInterestJob,
};