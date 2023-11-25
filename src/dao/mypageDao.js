// 특정 userId로 사용자 조회
async function selectUserByUserId(connection, userId) {
const selectUserQuery = `
            SELECT userName, jobName, school, major, grade, userIdx, phoneNum, nickName, jobName
            FROM User
            WHERE userId = ?;
            `;
const [userRow] = await connection.query(selectUserQuery, [userId]);
return userRow;
}

// 이미지 파일 조회
async function selectUserImage(connection, userIdx) {
  const selectUserImageQuery = `
    SELECT imageUrl
    FROM profile_images
    WHERE userIdx = ?;
  ;`;
  const [userImageUrl] = await connection.query(selectUserImageQuery, [userIdx]);

  // 프로필 이미지 유무 체크
  if (userImageUrl.length === 0) return null;

  return userImageUrl;
}

// 개인 정보 수정
async function updateUserInfo(connection, userId, updatedFields) {
  const { userName, major, grade, school, phoneNum } = updatedFields;
  const updateUserInfoQuery = `
    UPDATE User
    SET userName = ?, major = ?, grade = ?, school = ?, phoneNum = ?
    WHERE userId = ?
  `;
  const [result] = await connection.query(updateUserInfoQuery, [userName, major, grade, school, phoneNum, userId]);

  // 변경된 행이 없으면 null 반환
  if (result.changedRows === 0) {
    return null;
  }

  // 변경된 행이 있다면 업데이트된 사용자 정보 반환
  return { userId, ...updatedFields };
}

// 프로필 정보 수정
async function updateProfile(connection, userId, userIdx, nickName, jobName, imageUrl) {
  // User 테이블 업데이트 쿼리
  const updateQuery = `
      UPDATE User
      SET nickName = ?, jobName = ?
      WHERE userId = ?;
  `;
  const updateParams = [nickName, jobName, userId];

  // User 테이블 업데이트 
  const result = await connection.query(updateQuery, updateParams);

  // 이미지 URL이 변경되었을 경우에만 profile_images 테이블에 데이터 추가 또는 업데이트
  if (imageUrl) {
    const existingImage = await connection.query(`
        SELECT * FROM profile_images
        WHERE userIdx = ?;
    `, [userIdx]);

    if (existingImage[0].length > 0) {
      // 이미지 URL이 이미 존재하면 업데이트
      await connection.query(`
          UPDATE profile_images
          SET imageUrl = ?
          WHERE userIdx = ?;
      `, [imageUrl, userIdx]);
      console.log("Image update success");
    } else {
      // 이미지 URL이 존재하지 않으면 추가
      await connection.query(`
          INSERT INTO profile_images (userIdx, imageUrl) VALUES (?, ?);
      `, [userIdx, imageUrl]);
      console.log("Image insert success");
    }
  } else {
    // If imageUrl is null, update profile_images to set imageUrl as null
    await connection.query(`
        UPDATE profile_images
        SET imageUrl = NULL
        WHERE userIdx = ?;
    `, [userIdx]);
    console.log("Image set to null success");
  }

  // 변경된 행이 없으면 null 반환
  if (result.changedRows === 0) {
    return null;
  }

  // 변경된 행이 없으면 null 반환
  if (result.changedRows === 0) {
    return null;
  }

  // 변경된 행이 있다면 업데이트된 사용자 정보 반환
  return { userId, nickName, jobName, profileImageUrl: imageUrl };
}


// qj 고유 번호 조회(제목 등 해당 아이디의 qj 데이터 목록 조회)
async function selectQJ(connection, userId) {
  const selectSetIdxQuery = `
    SELECT DISTINCT setIdx
    FROM recommendGPT
    WHERE userId = ?
  ;`;
  const [setIdxResults] = await connection.query(selectSetIdxQuery, userId);

  const setIdx = setIdxResults.map(result => result.setIdx);

  const selectQJStorageQuery = `
    SELECT DISTINCT title, 
                    DATE_FORMAT(createAt, '%Y-%m-%d') as createAt, 
                    setIdx
    FROM recommendGPT
    WHERE setIdx IN (?)
    ORDER BY createAt DESC; -- createAt을 기준으로 내림차순 정렬
  ;`;
  const [qjStorage] = await connection.query(selectQJStorageQuery, [setIdx]);

  return qjStorage;
}

async function selectQJData(connection, setIdx, userId) {
  const selectQJDataQuery = `
    SELECT title, score, comment
    FROM recommendGPT
    WHERE userId = ? AND setIdx = ?
    ORDER BY score DESC;
  ;`;

  const [QJData] = await connection.query(selectQJDataQuery, [userId, setIdx]);

  return QJData;
}

module.exports = {
  selectQJData,
  selectQJ,
  updateProfile,
  selectUserImage,
  selectUserByUserId,
  updateUserInfo,
};