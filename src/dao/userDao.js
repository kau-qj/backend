// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
      SELECT userId, userPw, grade, major, phoneNum, school, jobIdx
      FROM User;
  `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}
  
  // 이메일로 회원 조회
  async function selectUserEmail(connection, email) {
    
    const selectUserEmailQuery = `
        SELECT userId, userPw, grade, major, phoneNum, school, jobIdx
        FROM User
        WHERE email = ?;
    `;
    const [userRows] = await connection.query(selectUserEmailQuery, email);
    return userRows;
}

  
  // userId 회원 조회
  async function selectUserId(connection, userId) {
    const selectUserIdQuery = `
        SELECT userId, userPw, grade, major, phoneNum, school, jobIdx
        FROM User
        WHERE userId = ?;
    `;
    const [userRow] = await connection.query(selectUserIdQuery, userId);
    return userRow;
}
  
  // 유저 생성
  async function insertUserInfo(connection, userInfo) {
    console.log("33333");
    const { userId, userPw, grade, major, phoneNum, school, jobIdx } = userInfo;
    const insertUserInfoQuery = `
        INSERT INTO User(userId, userPw, grade, major, phoneNum, school, jobIdx)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const insertUserInfoRow = await connection.query(
        insertUserInfoQuery,
        [userId, userPw, grade, major, phoneNum, school, jobIdx]
    );
    console.log("44444");
    return insertUserInfoRow;
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
  
  // 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
  async function selectUserAccount(connection, userId) {
    const selectUserAccountQuery = `
        SELECT status, userId
        FROM User
        WHERE userId = ?;
    `;
    const [userAccountRow] = await connection.query(
        selectUserAccountQuery,
        userId
    );
    return userAccountRow;
}
  
// 유저 정보 수정
async function updateUserInfo(connection, userId, nickname) {
  const updateUserQuery = `
      UPDATE User
      SET nickname = ?
      WHERE userId = ?;
  `;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, userId]);
  return updateUserRow;
}
  
  module.exports = {
    selectUser,
    selectUserEmail,
    selectUserId,
    insertUserInfo,
    selectUserPassword,
    selectUserAccount,
    updateUserInfo,
  };