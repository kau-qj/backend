// 게시글 생성
async function createPost(connection, [postName, userId, title, mainText, postType]) {
    const createPostQuery = `
        INSERT INTO Board (postName, userId, title, mainText, postType)
        VALUES (?, ?, ?, ?, ?);
    `;
    const createPostRow = await connection.query(
        createPostQuery,
        [postName, userId, title, mainText, postType]
    );

    return createPostRow;
}

// 게시글 조회
async function selectPost(connection, postIdx) {
    const getPostQuery = `
        SELECT *
        FROM Board
        WHERE postIdx = ?;
    `;
    const [getPostRow] = await connection.query(getPostQuery, postIdx);

    return getPostRow;
}

// 게시글 수정
async function updatePost(connection, [title, mainText, postIdx]) {
    const updatePostQuery = `
        UPDATE Board
        SET title = ?, mainText = ?
        WHERE postIdx = ?;
    `;
    const updatePostRow = await connection.query(
        updatePostQuery,
        [title, mainText, postIdx]
    );

    return updatePostRow;
}

// 게시글 삭제
async function deletePost(connection, postIdx) {
    const deletePostQuery = `
        DELETE FROM Board
        WHERE postIdx = ?;
    `;
    const [deletePostRow] = await connection.query(deletePostQuery, postIdx);

    return deletePostRow;
}

// 댓글 생성
async function createComment(connection, postIdx, userId, contents) {
    const createCommentQuery = `
      INSERT INTO Comment (PostIdx, UserId, contents)
      VALUES (?, ?, ?);
    `;
    const [createCommentRow] = await connection.query(createCommentQuery, [postIdx, userId, contents]);
    console.log("createCommentRow: ", createCommentRow.insertId);
    return createCommentRow.insertId;
}

// 댓글 조회
async function selectComment(connection, commentIdx) {

    const selectCommentQuery = `
        SELECT *
        FROM Comment
        WHERE CommentIdx = ?;
    `;
    const [commentRow] = await connection.query(selectCommentQuery, commentIdx);
    console.log("commentRow: ", commentRow);
    return commentRow;
}

// 댓글 삭제
async function deleteComment(connection, commentIdx) {
    const deleteCommentQuery = `
        DELETE FROM Comment
        WHERE CommentIdx = ?;
    `;
    console.log("댓글삭제1");
    const [deleteCommentRow] = await connection.query(deleteCommentQuery, commentIdx);

    return deleteCommentRow;
}  

module.exports = {
    createPost,
    selectPost,
    updatePost,
    deletePost,
    createComment,
    selectComment,
    deleteComment
};
