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
    const deletePostRow = await connection.query(deletePostQuery, postIdx);

    return deletePostRow;
}

module.exports = {
    createPost,
    selectPost,
    updatePost,
    deletePost
};
