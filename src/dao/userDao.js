// userId 중복 검증
async function selectUserId(connection, userId) {
  
  const selectUserIdQuery = `
      SELECT userId
      FROM User
      WHERE userId = ?;
  `;

  const [userRow] = await connection.query(selectUserIdQuery, userId);

  return userRow;
}

// nickName 중복 검증
async function selectUserName(connection, userName) {
  const selectUserNameQuery = `
    SELECT userName
    FROM User
    WHERE userName = ?
  ;`;

  const [nickNameRow] = await connection.query(selectUserNameQuery, userName);

  return nickNameRow
}


// 유저 생성
async function insertUserInfo(connection, userInfo) {
  const userId = userInfo[0];
  const userPw = userInfo[1];
  const grade = userInfo[2];
  const major = userInfo[3];
  const phoneNum = userInfo[4];
  const school = userInfo[5];
  const jobName = userInfo[6];
  const userName = userInfo[7];

  const insertUserInfoQuery = `
      INSERT INTO User(userId, userPw, grade, major, phoneNum, school, jobName, userName)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      [userId, userPw, grade, major, phoneNum, school, jobName, userName]
  );
  // Retrieve the inserted user information
  const insertedUserInfoQuery = `
      SELECT userId, grade, major, phoneNum, school, jobName, userName
      FROM User
      WHERE userId = ?;
  `;
  const [insertedUserInfo] = await connection.query(insertedUserInfoQuery, [userId]);

  return insertedUserInfo[0];
}

  
// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
      SELECT userId, userPw
      FROM User
      WHERE userId = ? AND userPw = ?;
  `;
  const selectUserPasswordRow = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}
  
module.exports = {
  selectUserName,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
};