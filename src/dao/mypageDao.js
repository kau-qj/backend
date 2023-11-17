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
async function updateProfile(connection, userId, nickName, jobName) {
  const updateProfileQuery = `
    UPDATE User
    SET nickName = ?, jobName = ?
    WHERE userId = ?
  ;`;
  const [result] = await connection.query(updateProfileQuery, [nickName, jobName, userId]);
  // 변경된 행이 없으면 null 반환
  if (result.changedRows === 0) {
    return null;
  }

  // 변경된 행이 있다면 업데이트된 사용자 정보 반환
  return { userId, nickName, jobName };
}

// qj 정보 조회
async function selectQJ(connection, userId) {
  const selectQJQuery = `
    SELECT
    FROM recommendGPT
    WHERE userId = ?
  ;`;
}

// 개인정보 업데이트
// async function updateUserInfo(connection, userIdx, updatedInfo) {
//   const fields = ['school', 'major', 'grade', 'userName', 'phoneNum'];
//   const queryValues = [];
//   const updateFields = [];

//   for (const field of fields) {
//     if (field in updatedInfo && updatedInfo[field] !== undefined) {
//       updateFields.push(`?? = ?`);
//       queryValues.push(field, updatedInfo[field]);
//     }
//   }

//   if (updateFields.length === 0) {
//     console.log('No fields to update');
//     return null;
//   }

//   queryValues.push(userIdx);

//   const updateQuery = `
//     UPDATE User 
//     SET 
//       ${updateFields.join(', ')}
//     WHERE userIdx = ?;
//   `;

//   // console.log('Executing query:', updateQuery, 'with values:', queryValues);

//   const updateUserRow = await connection.query(updateQuery, queryValues);
  
//   if (updateUserRow.affectedRows === 0) {
//     // console.log('No rows were updated');
//     return null;
//   }

//   return updateUserRow;
// }

// 프로필 설정 업데이트
async function updateUserProfile(connection, userIdx, updatedInfo) {
  const fields = ['nickname', 'jobName'];
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

async function insertUserProfileImage(connection, userIdx, imageUrl) {
  const insertProfileImageQuery = `
    INSERT INTO profile_images (userIdx, imageUrl) VALUES (?, ?);
  `;
  const insertProfileImageParams = [userIdx, imageUrl];
  
  const [insertProfileImageRows] = await connection.query(insertProfileImageQuery, insertProfileImageParams);
  return insertProfileImageRows;
}

module.exports = {
  updateProfile,
  selectUserImage,
  selectUserByUserId,
  updateUserInfo,
  updateUserProfile,
  insertUserProfileImage
};