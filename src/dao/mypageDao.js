// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT * 
                FROM User;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 특정 userIdx로 사용자 조회
async function selectUserByUserIdx(connection, userIdx) {
const selectUserQuery = `
            SELECT school, major, grade, userName, phoneNum 
            FROM User
            WHERE userIdx = ?;
            `;
const [userRow] = await connection.query(selectUserQuery, [userIdx]);
return userRow;
}

// 특정 userIdx로 프로필 정보 조회
async function selectUserProfileByUserIdx(connection, userIdx) {
const selectUserProfileQuery = `
            SELECT nickname, jobName
            FROM User
            WHERE userIdx = ?;
            `;
const [userRow] = await connection.query(selectUserProfileQuery, [userIdx]);
return userRow;
}

// 개인정보 업데이트
async function updateUserInfo(connection, userIdx, updatedInfo) {
  const fields = ['school', 'major', 'grade', 'userName', 'phoneNum'];
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
  selectUser,
  selectUserByUserIdx,
  selectUserProfileByUserIdx,
  updateUserInfo,
  updateUserProfile,
  insertUserProfileImage
};