// 게시글 생성
async function createPost(connection, [postName, userId, Title, mainText, postType]) {
    const createPostQuery = `
        INSERT INTO Board (postName, userId, Title, mainText, postType)
        VALUES (?, ?, ?, ?, ?);
    `;
    const createPostRow = await connection.query(
        createPostQuery,
        [postName, userId, Title, mainText, postType]
    );

    return createPostRow;
}

// 특정 게시판 게시글 조회
async function selectPosts(connection, postType) {
    const selectPostsQuery = `
        SELECT PostIdx, Title, SUBSTRING(mainText, 1, 1) AS mainText, createAt, userId
        FROM Board
        WHERE postType = ?;
    `;
    const [postsRows] = await connection.query(selectPostsQuery, postType);
    return postsRows;
}

// 게시글 상세보기
async function getPost(connection, PostIdx) {
    const getPostQuery = `
        SELECT userId, Title, mainText, createAt
        FROM Board
        WHERE PostIdx = ?;
    `;
    const [postRow] = await connection.query(getPostQuery, PostIdx);
    return postRow;
}

// 게시글에 대한 댓글 조회
async function selectComments(connection, PostIdx) {
    const selectCommentsQuery = `
        SELECT CommentIdx, PostIdx, userId, contents, createAt
        FROM Comment
        WHERE PostIdx = ?;
    `;
    const [commentsRows] = await connection.query(selectCommentsQuery, PostIdx);
    return commentsRows;
}



// 게시글 수정
async function updatePost(connection, [Title, mainText, PostIdx]) {
    const updatePostQuery = `
        UPDATE Board
        SET Title = ?, mainText = ?
        WHERE PostIdx = ?;
    `;
    const updatePostRow = await connection.query(
        updatePostQuery,
        [Title, mainText, PostIdx]
    );

    return updatePostRow;
}

// 게시글 삭제
async function deletePost(connection, PostIdx) {
    const deletePostQuery = `
        DELETE FROM Board
        WHERE PostIdx = ?;
    `;
    const [deletePostRow] = await connection.query(deletePostQuery, PostIdx);

    return deletePostRow;
}

// 댓글 생성
async function createComment(connection, PostIdx, userId, contents) {
    const createCommentQuery = `
      INSERT INTO Comment (PostIdx, userId, contents)
      VALUES (?, ?, ?);
    `;
    const [createCommentRow] = await connection.query(createCommentQuery, [PostIdx, userId, contents]);
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
    const [deleteCommentRow] = await connection.query(deleteCommentQuery, commentIdx);

    return deleteCommentRow;
}  

module.exports = {
    createPost,
    selectPosts,
    getPost,
    selectComments,
    updatePost,
    deletePost,
    createComment,
    selectComment,
    deleteComment
};
