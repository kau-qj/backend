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

// 관심 직무 조회
async function selectInterestJob(connection, userId) {
  const currentInterestJobQuery = `
    SELECT jobName
    FROM User
    WHERE userId = ?;
  `;
  const [interestJobResult] = await connection.query(currentInterestJobQuery, [userId]);
  return interestJobResult.length > 0 ? interestJobResult[0].jobName : null;
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

// DB에 저장된 jobname이 아니어도 추가가 되도록 수정?
// 1개도 없으면 = null로 되어있는 경우
// 만약 등록이 되어있다면, 추가를 눌렀을 때 바꾸시겠습니까? -> 
// 관심 직무 최대 하나로 추가 User 테이블의 jobName

// 관심 직무 추가
async function insertInterestJob(connection, userId, jobname) {

  // User 테이블에서 현재 관심 직무 목록 조회
  // const currentInterestJobQuery = `
  //   SELECT jobName
  //   FROM User
  //   WHERE userId = ?;
  // `;
  // const [currentInterestJobResult] = await connection.query(currentInterestJobQuery, [userId]);

  // // 해당 사용자의 관심 직무가 이미 있는 경우
  // if (currentInterestJobResult.length > 0 && currentInterestJobResult[0].jobName) {
  //   // 이미 관심 직무가 있다는 메시지 반환
  //   return '최대 한 개의 관심 직무 등록이 가능합니다.';
  // }

  // User 테이블에 관심 직무 추가
  const insertInterestJobQuery = `
    INSERT INTO User (userId, jobName)
    VALUES (?, ?);
  `;
  const result = await connection.query(insertInterestJobQuery, [userId, jobname]);

  if (result.affectedRows > 0) {
    // 관심 직무가 성공적으로 추가되었다는 메시지 반환
    return '관심 직무가 추가되었습니다.';
  } else {
    // 데이터베이스에 변경이 없다는 메시지 반환
    return null;
  }
}

// 관심 직무 업데이트
async function updateInterestJob(connection, userId, jobname) {
  const updateInterestJobQuery = `
    UPDATE User
    SET jobName = ?
    WHERE userId = ?;
  `;

  const result = await connection.query(updateInterestJobQuery, [jobname, userId]);
  if (result.affectedRows > 0) {
    // 업데이트가 성공적으로 이루어졌다는 메시지 반환
    return '관심 직무가 업데이트되었습니다.';
  } else {
    // 데이터베이스에 변경이 없다는 메시지 반환
    return '업데이트할 관심 직무가 없습니다.';
  }
}


module.exports = {
  selectJobInfoByKeyword,
  selectJobDetailsByName,
  selectInterestJob,
  selectImageUrlByJobname,
  insertInterestJob,
  updateInterestJob,
};