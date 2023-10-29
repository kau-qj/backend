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

// 특정 userIdx로 사용자 개인정보 수정
async function updateUserInfo(connection, userIdx, updatedInfo) {
  const fields = ['school', 'major', 'grade', 'userName', 'phoneNum'];
  const queryValues = [userIdx];
  const updateFields = [];

  for (const field of fields) {
    if (updatedInfo[field] !== undefined) {
      updateFields.push(`${field} = ?`);
      queryValues.push(updatedInfo[field]);
    }
  }

  if (updateFields.length === 0) {
    return null; // 아무 것도 업데이트되지 않았을 때 null 반환
  }

  const updateQuery = `
    UPDATE User 
    SET 
      ${updateFields.join(', ')}
    WHERE userIdx = ?;
  `;

  const updateUserRow = await connection.query(updateQuery, queryValues);
  return updateUserRow[0];
}

// 프로필 설정 업데이트
async function updateUserProfile(connection, userIdx, updatedData) {
  const { nickname, jobName } = updatedData;
  const updateUserQuery = `
    UPDATE User 
    SET 
      nickname = ?,
      jobName = ?
    WHERE userIdx = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, jobName, userIdx]);
  return updateUserRow[0];
}

module.exports = {
  selectUser,
  selectUserByUserIdx,
  selectUserProfileByUserIdx,
  updateUserInfo,
  updateUserProfile,
};