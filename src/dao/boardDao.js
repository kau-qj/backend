// 게시글 생성
async function createPost(connection, [userId, Title, mainText, postType]) {
    const createPostQuery = `
        INSERT INTO Board (userId, Title, mainText, postType)
        VALUES (?, ?, ?, ?);
    `;
    const createPostRow = await connection.query(
        createPostQuery,
        [userId, Title, mainText, postType]
    );

    return createPostRow;
}

// 특정 게시판 게시글 조회
async function selectPosts(connection, postType) {
    const selectPostsQuery = `
        SELECT PostIdx, Title, SUBSTRING(mainText, 1, 20) AS mainText, createAt, userId
        FROM Board
        WHERE postType = ?;
    `;
    const [postsRows] = await connection.query(selectPostsQuery, postType);
    return postsRows;
}

// 게시글 상세보기
async function getPost(connection, PostIdx) {
    const getPostQuery = `
        SELECT Board.userId, User.nickName, Board.Title, Board.mainText, Board.createAt
        FROM Board
        INNER JOIN User ON Board.userId = User.userId
        WHERE Board.PostIdx = ?;
    `;
    const [postRow] = await connection.query(getPostQuery, PostIdx);
    return postRow;
}

// 게시글에 대한 댓글 조회
async function selectComments(connection, PostIdx) {
    const selectCommentsQuery = `
        SELECT Comment.CommentIdx, Comment.PostIdx, Comment.userId, User.nickName, Comment.contents, Comment.createAt
        FROM Comment
        INNER JOIN User ON Comment.userId = User.userId
        WHERE Comment.PostIdx = ?;
    `;
    const [commentsRows] = await connection.query(selectCommentsQuery, PostIdx);
    return commentsRows;
}


// 게시글 작성자 조회
async function selectPostUserId(connection, postIdx) {
    const selectPostUserIdQuery = `
        SELECT userId 
        FROM Board
        WHERE postIdx = ?;
    `;
    const [postRow] = await connection.query(selectPostUserIdQuery, postIdx);
    return postRow.length > 0 ? postRow[0].userId : null;
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
    selectPostUserId,
    updatePost,
    deletePost,
    createComment,
    selectComment,
    deleteComment
};
